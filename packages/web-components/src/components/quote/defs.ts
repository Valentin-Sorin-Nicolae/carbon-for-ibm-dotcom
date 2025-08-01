/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export enum QUOTE_TYPES {
  /**
   * Default - double-curved
   */
  DEFAULT = 'double-curved',

  /**
   * single-curved
   */
  SINGLE_CURVED = 'single-curved',

  /**
   * single-angle
   */
  SINGLE_ANGLE = 'single-angle',

  /**
   * double-angle
   */
  DOUBLE_ANGLE = 'double-angle',

  /**
   * low-high-reversed-double-curved
   */
  LOW_HIGH_REVERSED_DOUBLE_CURVED = 'low-high-reversed-double-curved',

  /**
   * corner-bracket
   */
  CORNER_BRACKET = 'corner-bracket',
}

export enum APPEARANCE {
  /**
   * Default - legacy
   */
  DEFAULT = 'legacy',

  /**
   * card
   */
  CARD = 'card',

  /**
   * bubble-quote
   */
  BUBBLE_QUOTE = 'bubble-quote',
}
