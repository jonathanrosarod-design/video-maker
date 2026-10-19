import {Composition, Still} from 'remotion';
import {IntroVideo} from './IntroVideo';
import {AscendlyAd} from './AscendlyAd';
import {AscendCrewBrand} from './AscendCrewBrand';
import {AscendCrewSheet} from './AscendCrewSheet';

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
        durationInFrames={750}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
      <Composition
        id="AscendCrewBrand"
        component={AscendCrewBrand}
        durationInFrames={450}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{
          handle: '@ascendcrew',
          services: ['INBOX & EMAIL', 'CALENDAR & BOOKING', 'ADMIN & OPS'],
        }}
      />
      <Still id="AscendCrewSheet" component={AscendCrewSheet} width={1080} height={1350} defaultProps={{colorway: 'clay'}} />
      <Still id="AscendCrewSheetChalk" component={AscendCrewSheet} width={1080} height={1350} defaultProps={{colorway: 'chalk'}} />
    </>
  );
};
