/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import settings from '@carbon/ibmdotcom-utilities/es/utilities/settings/settings.js';
import styles from './quote.scss';
import StableSelectorMixin from '../../globals/mixins/stable-selector';
import { APPEARANCE, QUOTE_TYPES } from './defs';
import '../horizontal-rule/horizontal-rule';
import { carbonElement as customElement } from '@carbon/web-components/es/globals/decorators/carbon-element.js';
import LocaleAPI from '@carbon/ibmdotcom-services/es/services/Locale/Locale.js';
import HostListenerMixin from '@carbon/web-components/es/globals/mixins/host-listener.js';
import MediaQueryMixin, {
  MQBreakpoints,
  MQDirs,
} from '../../component-mixins/media-query/media-query';

export { QUOTE_TYPES };

const { prefix, stablePrefix: c4dPrefix } = settings;

const slotExistencePropertyNames = {
  'source-heading': '_hasSourceHeading',
  'source-copy': '_hasSourceCopy',
  'source-bottom-copy': '_hasSourceBottomCopy',
  footer: '_hasFooter',
};

/**
 * Quote.
 *
 * @element c4d-quote
 * @slot copy - The copy content.
 * @slot footer - The footer (CTA) content.
 * @slot source-heading - The heading content of the quote source.
 * @slot source-copy - The copy content of the quote source.
 * @slot source-bottom-copy - The copy content of the quote source placed at the bottom.
 * @csspart mark - Quote mark. Usage `c4d-quote::part(mark)`
 * @csspart mark--opening - Opening quote mark. Usage `c4d-quote::part(mark--opening)`
 * @csspart mark--closing - Closing quote mark. Usage `c4d-quote::part(mark--closing)`
 * @csspart copy - Quote body copy. Usage `c4d-quote::part(copy)`
 * @csspart source - Quote source slot. Usage `c4d-quote::part(source)`
 * @csspart footer - Quote footer. Usage `c4d-quote::part(footer)`
 * @csspart container - Quote container. Usage `c4d-quote::part(container)`
 * @csspart wrapper - Quote wrapper. Usage `c4d-quote::part(wrapper)`
 * @csspart hr - Horizontal rule. Usage `c4d-quote::part(wrapper)`
 * @csspart bubble-pointer-svg - The bubble quote variation pointer. Usage `c4d-quote::part(bubble-pointer-svg)`
 * @csspart bubble-pointer-fill-svg - The fill color of the pointer. Usage `c4d-quote::part(bubble-pointer-fill-svg)`
 * @csspart bubble-pointer-stroke-svg - The stroke color of the pointer. Usage `c4d-quote::part(bubble-pointer-stroke-svg)`
 */
@customElement(`${c4dPrefix}-quote`)
class C4DQuote extends MediaQueryMixin(
  HostListenerMixin(StableSelectorMixin(LitElement)),
  { [MQBreakpoints.MD]: MQDirs.MIN }
) {
  /**
   * Defines rendered quote mark style
   * styles:
   * `double-curved`: `“ ”`;
   * `single-curved`: `‘ ’`;
   * `single-angle`: `‹ ›`;
   * `double-angle`: `« »`;
   * `low-high-reversed-double-curved`: `„ “`;
   * `corner-bracket`: `「 」`;
   */
  @property({ reflect: true, attribute: 'mark-type' })
  markType = QUOTE_TYPES.DEFAULT;

  @property({ reflect: true, attribute: 'lang' })
  lc;

  // Options: 'legacy' (default), 'card', 'bubble-quote' (last two are mobile only)
  @property({ reflect: true, attribute: 'appearance' })
  appearance = APPEARANCE.DEFAULT; // 'legacy' (default)

  /**
   * `true` if there is source heading.
   */
  protected _hasSourceHeading = false;

  /**
   * `true` if there is source copy.
   */
  protected _hasSourceCopy = false;

  /**
   * `true` if there is source bottom copy.
   */
  protected _hasSourceBottomCopy = false;

  /**
   * `true` if there is cta.
   */
  protected _hasFooter = false;

  @state()
  _isMobile = !this.carbonBreakpoints.md.matches;

  /**
   * Handles `slotchange` event.
   */

  connectedCallback() {
    super.connectedCallback();
    LocaleAPI.getLang().then(({ lc }) => {
      this.lc = lc;
    });
  }

  mediaQueryCallbackMD() {
    this._isMobile = !this.carbonBreakpoints.md.matches;
  }

  protected _handleSlotChange({ target }: Event) {
    const { name } = target as HTMLSlotElement;
    const hasContent = (target as HTMLSlotElement)
      .assignedNodes()
      .some(
        (node) => node.nodeType !== Node.TEXT_NODE || node!.textContent!.trim()
      );
    this[slotExistencePropertyNames[name]] = hasContent;
    this.requestUpdate();
  }

  protected _getQuoteMarks(): { open: string; close: string } {
    switch (this.markType) {
      case QUOTE_TYPES.SINGLE_CURVED:
        return { open: '‘', close: '’' };
      case QUOTE_TYPES.DOUBLE_ANGLE:
        return { open: '«', close: '»' };
      case QUOTE_TYPES.SINGLE_ANGLE:
        return { open: '‹', close: '›' };
      case QUOTE_TYPES.LOW_HIGH_REVERSED_DOUBLE_CURVED:
        return { open: '„', close: '“' };
      case QUOTE_TYPES.CORNER_BRACKET:
        return { open: '「', close: '」' };
      case QUOTE_TYPES.DEFAULT:
      default:
        return {
          open: this.lc !== 'ar' ? '“' : '”',
          close: this.lc !== 'ar' ? '”' : '“',
        };
    }
  }

  protected _renderQuote() {
    // If the appearance is legacy (or not provided), use the original rendering logic
    if (this.appearance === 'legacy') {
      switch (this.markType) {
        case QUOTE_TYPES.SINGLE_CURVED:
          return html`
            <span class="${prefix}--quote__mark" part="mark mark--opening"
              >‘</span
            >
            <blockquote class="${prefix}--quote__copy" part="copy">
              <slot></slot>
              <span
                class="${prefix}--quote__mark-closing"
                part="mark mark--closing"
                >’</span
              >
            </blockquote>
          `;
        case QUOTE_TYPES.DOUBLE_ANGLE:
          return html`
            <span class="${prefix}--quote__mark" part="mark mark--opening"
              >«</span
            >
            <blockquote class="${prefix}--quote__copy" part="copy">
              <slot></slot>
              <span
                class="${prefix}--quote__mark-closing"
                part="mark mark--closing"
                >»</span
              >
            </blockquote>
          `;
        case QUOTE_TYPES.SINGLE_ANGLE:
          return html`
            <span class="${prefix}--quote__mark" part="mark mark--opening"
              >‹</span
            >
            <blockquote class="${prefix}--quote__copy" part="copy">
              <slot></slot>
              <span
                class="${prefix}--quote__mark-closing"
                part="mark mark--closing"
                >›</span
              >
            </blockquote>
          `;
        case QUOTE_TYPES.LOW_HIGH_REVERSED_DOUBLE_CURVED:
          return html`
            <span class="${prefix}--quote__mark" part="mark mark--opening"
              >„</span
            >
            <blockquote class="${prefix}--quote__copy" part="copy">
              <slot></slot>
              <span
                class="${prefix}--quote__mark-closing"
                part="mark mark--closing"
                >“</span
              >
            </blockquote>
          `;
        case QUOTE_TYPES.CORNER_BRACKET:
          return html`
            <span
              class="${prefix}--quote__mark ${prefix}--quote__mark-corner-bracket"
              part="mark mark--opening">
              「
            </span>
            <blockquote class="${prefix}--quote__copy" part="copy">
              <slot></slot>
              <span
                class="${prefix}--quote__mark-closing"
                part="mark mark--closing"
                >」</span
              >
            </blockquote>
          `;
        default:
          return html`
            <span class="${prefix}--quote__mark" part="mark mark--opening">
              ${this.lc !== 'ar' ? '“' : '”'}
            </span>
            <blockquote class="${prefix}--quote__copy" part="copy">
              <slot></slot>
              <span
                class="${prefix}--quote__mark-closing"
                part="mark mark--closing">
                ${this.lc !== 'ar' ? '”' : '“'}
              </span>
            </blockquote>
          `;
      }
    }
    // For the appearances "card" and "bubble-quote"
    else if (this.appearance === 'card' || this.appearance === 'bubble-quote') {
      const marks = this._getQuoteMarks();
      return html`
        <span class="${prefix}--quote__mark" part="mark mark--opening">
          ${marks.open}
        </span>
        <blockquote
          class="${prefix}--quote__copy ${this.appearance === 'bubble-quote' ||
          this.appearance === 'card'
            ? `${prefix}-bubble-quote`
            : ''}"
          part="copy">
          <slot></slot>
          ${this.appearance === 'bubble-quote'
            ? html`
                <svg
                  width="47"
                  height="37"
                  viewBox="0 0 47 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="bubble-pointer"
                  part="bubble-pointer-svg">
                  <path
                    d="M4 31.84V4.5C4 2.29086 2.20914 0.5 0 0.5V0H46.6569V0.5C45.596 0.5 44.5786 0.919855 43.8284 1.67L10.8284 34.67C8.30857 37.1899 4 35.4036 4 31.84Z"
                    fill="#F4F4F4"
                    class="bubble-pointer-fill"
                    part="bubble-pointer-fill-svg" />
                  <path
                    d="M0 0.5C2.20914 0.5 4 2.29086 4 4.5V31.84C4 35.4036 8.30857 37.1899 10.8284 34.67L43.8284 1.67C44.5786 0.919855 45.596 0.5 46.6569 0.5"
                    stroke="#8D8D8D"
                    class="bubble-pointer-stroke"
                    part="bubble-pointer-stroke-svg" />
                </svg>
              `
            : ''}
          <span
            class="${prefix}--quote__mark-closing"
            part="mark mark--closing">
            ${marks.close}
          </span>
          ${this._isMobile && this.appearance == 'card'
            ? html` ${this._renderSource()} ${this._renderFooter()} `
            : ''}
        </blockquote>
      `;
    }
    // Ensure all code paths return a value
    return null;
  }

  protected _renderSource() {
    const {
      _hasSourceHeading: hasSourceHeading,
      _hasSourceCopy: hasSourceCopy,
      _handleSlotChange: handleSlotChange,
    } = this;
    return html`
      <div
        ?hidden="${!hasSourceHeading || !hasSourceCopy}"
        class="${prefix}--quote__source"
        part="source">
        <slot @slotchange="${handleSlotChange}" name="source-heading"></slot>
        <slot @slotchange="${handleSlotChange}" name="source-copy"></slot>
        <slot
          @slotchange="${handleSlotChange}"
          name="source-bottom-copy"></slot>
      </div>
    `;
  }

  protected _renderFooter() {
    const { _hasFooter: hasFooter, _handleSlotChange: handleSlotChange } = this;
    return html`
      <div
        ?hidden="${!hasFooter}"
        class="${prefix}--quote__footer"
        part="footer">
        <c4d-hr part="hr"></c4d-hr>
        <slot name="footer" @slotchange="${handleSlotChange}"></slot>
      </div>
    `;
  }

  render() {
    return html`
      <div class="${prefix}--quote__container" part="container">
        <div class="${prefix}--quote__wrapper" part="wrapper">
          ${this._renderQuote()}${this._renderSource()}${this._renderFooter()}
        </div>
      </div>
    `;
  }

  static get stableSelector() {
    return `${c4dPrefix}--quote`;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

/* @__GENERATE_REACT_CUSTOM_ELEMENT_TYPE__ */
export default C4DQuote;
