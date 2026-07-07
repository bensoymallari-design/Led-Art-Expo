import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { EffectType } from 'led-art-shared';
export function EffectRenderer({ effect, children }: PropsWithChildren<{ effect?: EffectType }>) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => { if (effect === 'blink' || effect === 'pulse') Animated.loop(Animated.sequence([Animated.timing(opacity, { toValue: 0.25, duration: 500, useNativeDriver: true }), Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true })])).start(); }, [effect, opacity]);
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}
