import { RGBColor, HSVColor, StringColor } from './ColorTypes';
export declare function GetReadableTextColor(color: RGBColor | HSVColor | StringColor | string): RGBColor | HSVColor | "#000" | "#fff";
/**
 * Shifts the hue of the `HSVColor` by the Value
 */
export declare function ShiftHue(hsv: HSVColor, value: number): HSVColor;
