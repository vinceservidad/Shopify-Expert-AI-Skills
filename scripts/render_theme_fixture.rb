# frozen_string_literal: true

# Render the actual teaching theme with Shopify's open-source Liquid engine.
# Proprietary Shopify tags, filters and objects below are NARROW TEST ADAPTERS.
# They do not establish storefront, theme-editor, market or cart compatibility.
require 'json'
require 'cgi'
require 'optparse'
require 'liquid'

module ThemeFixture
  ROOT = File.expand_path('..', __dir__)
  ASSETS = File.join(ROOT, 'skills/shopify-theme-development/assets/worked-example')

  # This adapter implements only the documented product-form signature used by
  # this example. Reject other signatures instead of silently pretending support.
  class ProductForm < Liquid::Block
    def initialize(tag_name, markup, parse_context)
      super
      match = /\A\s*(['"])product\1\s*,\s*product\s*,\s*id:\s*([a-zA-Z_][a-zA-Z_0-9.]*)\s*\z/.match(markup)
      raise Liquid::SyntaxError, 'Fixture supports only product forms with an explicit id expression' unless match

      @id_expression = parse_expression(match[2], safe: true)
    end

    def render_to_output_buffer(context, output)
      form_id = CGI.escapeHTML(context.evaluate(@id_expression).to_s)
      product_id = CGI.escapeHTML(context['product'].fetch('id').to_s)
      raise Liquid::ArgumentError, 'Fixture product form requires nonempty IDs' if form_id.empty? || product_id.empty?

      output << %(<form method="post" action="/cart/add" id="#{form_id}" accept-charset="UTF-8" class="shopify-product-form" enctype="multipart/form-data">)
      output << '<input type="hidden" name="form_type" value="product"><input type="hidden" name="utf8" value="✓">'
      super
      output << %(<input type="hidden" name="product-id" value="#{product_id}"></form>)
    end
  end

  class Schema < Liquid::Raw
    def parse(tokens)
      super
      schema = JSON.parse(@body)
      unless schema.is_a?(Hash) && schema['name'].is_a?(String) && schema['settings'].is_a?(Array)
        raise Liquid::SyntaxError, 'Fixture section schema needs name and settings'
      end
    rescue JSON::ParserError => e
      raise Liquid::SyntaxError, "Invalid section schema JSON: #{e.message}"
    end

    def render_to_output_buffer(_context, output)
      output
    end
  end

  module Filters
    def money(input)
      raise Liquid::ArgumentError, 'Fixture money requires integer GBP minor units' unless input.is_a?(Integer)

      format('£%d.%02d', input / 100, input % 100)
    end

    def t(input)
      translated = input.split('.').reduce(@context.registers[:translations]) { |value, key| value.fetch(key) }
      raise Liquid::ArgumentError, "Fixture translation must be a string: #{input}" unless translated.is_a?(String)

      translated
    rescue KeyError, NoMethodError
      raise Liquid::ArgumentError, "Missing fixture translation: #{input}"
    end

    def asset_url(input)
      unless input.is_a?(String) && /\A[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+\z/.match?(input)
        raise Liquid::ArgumentError, 'Fixture only supports local asset filenames'
      end
      raise Liquid::ArgumentError, "Missing fixture asset: #{input}" unless File.file?(File.join(@context.registers[:theme], 'assets', input))

      "/#{input}"
    end
  end

  def self.environment
    Liquid::Environment.build do |env|
      env.register_tag('form', ProductForm)
      env.register_tag('schema', Schema)
      env.register_filter(Filters)
    end
  end

  def self.render_source(source, assigns, registers)
    template = Liquid::Template.parse(source, environment: environment, error_mode: :strict2)
    template.render!(assigns, registers: registers, strict_variables: true, strict_filters: true)
  end

  def self.render(theme:, input:, selected: nil, section_only: false, section_id: nil)
    raise ArgumentError, 'Only explicitly synthetic fixtures are accepted' unless input['synthetic'] == true

    variants = input.fetch('variants').map do |variant|
      price = /\A£([0-9]+)\.([0-9]{2})\z/.match(variant.fetch('price'))
      raise ArgumentError, 'Fixture prices must be explicit GBP amounts' unless price

      variant.merge('price' => price[1].to_i * 100 + price[2].to_i)
    end
    current = if selected
      variants.find { |variant| variant.fetch('id') == selected } || (raise ArgumentError, 'Unknown fixture variant')
    else
      variants.find { |variant| variant.fetch('available') } || variants.first
    end
    raise ArgumentError, 'A fixture product requires at least one variant' unless current

    product = {
      'id' => '900001', 'title' => input.fetch('product_title'), 'url' => input.fetch('product_path'),
      'variants' => variants, 'selected_or_first_available_variant' => current
    }
    template = JSON.parse(File.read(File.join(theme, 'templates/product.json')))
    sections = template.fetch('sections')
    order = template.fetch('order')
    unless order.is_a?(Array) && !order.empty? && order.uniq == order && order.all? { |id| sections.key?(id) }
      raise ArgumentError, 'Template order must reference distinct existing sections'
    end
    registers = { translations: JSON.parse(File.read(File.join(theme, 'locales/en.default.json'))), theme: theme }
    rendered_sections = order.filter_map do |id|
      section = sections.fetch(id)
      next if section['disabled'] == true
      type = section.fetch('type')
      raise ArgumentError, 'Unsupported section filename' unless /\A[a-zA-Z0-9_-]+\z/.match?(type)

      resolved_id = section_id || "template--fixture__#{id}"
      assigns = { 'product' => product, 'section' => { 'id' => resolved_id, 'settings' => section.fetch('settings') } }
      content = render_source(File.read(File.join(theme, "sections/#{type}.liquid")), assigns, registers)
      %(<div id="shopify-section-#{CGI.escapeHTML(resolved_id)}" class="shopify-section">#{content}</div>)
    end.join
    return rendered_sections if section_only

    assigns = {
      'request' => { 'locale' => { 'iso_code' => 'en' } }, 'page_title' => product['title'],
      'canonical_url' => "http://localhost#{product['url']}",
      'content_for_header' => '<!-- Local Liquid fixture: no Shopify platform scripts. -->',
      'content_for_layout' => rendered_sections
    }
    render_source(File.read(File.join(theme, 'layout/theme.liquid')), assigns, registers)
  end
end

if $PROGRAM_NAME == __FILE__
  options = { theme: File.join(ThemeFixture::ASSETS, 'theme'), input_path: File.join(ThemeFixture::ASSETS, 'input.json') }
  OptionParser.new do |parser|
    parser.on('--theme PATH') { |value| options[:theme] = value }
    parser.on('--input PATH') { |value| options[:input_path] = value }
    parser.on('--variant ID') { |value| options[:selected] = value }
    parser.on('--section-only') { options[:section_only] = true }
    parser.on('--section-id ID') { |value| options[:section_id] = value }
  end.parse!
  begin
    input = JSON.parse(File.read(options.delete(:input_path)))
    puts ThemeFixture.render(**options, input: input)
  rescue StandardError => e
    warn "Theme fixture failed: #{e.class}: #{e.message}"
    exit 1
  end
end
