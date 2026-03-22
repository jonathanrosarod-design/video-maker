import {Composition} from 'remotion';
import {IntroVideo} from './IntroVideo';
import {AscendlyAd} from './AscendlyAd';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={IntroVideo}
        durationInFrames={210}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
      <Composition
        id="AscendlyAd"
        component={AscendlyAd}
        durationInFrames={600}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
    </>
  );
};
