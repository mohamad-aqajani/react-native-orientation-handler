/* eslint-disable no-unused-vars */

/* all input types are number. but they can change to string */

import { useEffect, useState } from "react";
import { Dimensions, PixelRatio, ScaledSize } from "react-native";

export declare type OrientationType = "Landscape" | "Portrait";

export declare type AdjustInputType<T = number> = { landscape: T; portrait: T };

export declare type Orientation<T = number | string> = {
  wp: (size: T) => number;
  hp: (size: T) => number;
  orientation: OrientationType;
  adjustedWP: (adjust: AdjustInputType) => number;
  adjustedHP: (adjust: AdjustInputType) => number;
};

/**
 * Can be used for handling screen orientation resizing.
 * @example const {wp, hp, orientation} = useOrientation()
 * width = wp(20)
 * width = adjustedWP({landscape: 40, portrait:60})
 */
export default function useOrientation(): Orientation<number> {
  const [screenDimensions, setScreenDimensions] = useState<ScaledSize>(Dimensions.get("window"));
  const [orientation, setOrientation] = useState<OrientationType>(
    screenDimensions.width < screenDimensions.height ? "Portrait" : "Landscape"
  );

  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize; screen: ScaledSize }) => {
      setScreenDimensions(window);
      const newOrientation: OrientationType =
        window.width < window.height ? "Portrait" : "Landscape";
      setOrientation(newOrientation);
    };

    Dimensions.addEventListener("change", onChange);
  });

  /**
   * Percent of screen width
   */
  const wp = (widthPercent: number) =>
    PixelRatio.roundToNearestPixel((screenDimensions.width * widthPercent) / 100);

  /**
   * Percent of screen height
   */
  const hp = (heightPercent: number) =>
    PixelRatio.roundToNearestPixel((screenDimensions.height * heightPercent) / 100);

  /**
   * Percent of screen width based on orientation
   */
  const adjustedWP = ({ landscape, portrait }: AdjustInputType) =>
    orientation === "Landscape" ? wp(landscape) : wp(portrait);

  /**
   * Percent of screen height based on orientation
   */
  const adjustedHP = ({ landscape, portrait }: AdjustInputType) =>
    orientation === "Landscape" ? hp(landscape) : hp(portrait);

  return {
    wp,
    hp,
    orientation,
    adjustedWP,
    adjustedHP,
  } as Orientation<number>;
}
