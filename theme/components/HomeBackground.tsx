import { HomeBackground as OriginalHomeBackground } from '@rspress/core/theme-original';

import { SoftAurora } from './SoftAurora';

export function HomeBackground() {
  return (
    <>
      <OriginalHomeBackground className="summer-home-background__base" />
      <div className="summer-home-background__layer" aria-hidden="true">
        <SoftAurora
          className="summer-soft-aurora"
          speed={0.6}
          scale={1.5}
          brightness={1}
          color1="#7bc8cd"
          color2="#92c144"
          noiseFrequency={2.5}
          noiseAmplitude={1}
          bandHeight={0.5}
          bandSpread={1}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1}
          enableMouseInteraction
          mouseInfluence={0.2}
        />
      </div>
      <div className="summer-home-background__overlay" aria-hidden="true" />
    </>
  );
}
