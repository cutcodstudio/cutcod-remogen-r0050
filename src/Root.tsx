import React from 'react';
import {Composition} from 'remotion';
import {RemogenReplica} from './RemogenReplica';

export const RemogenRoot: React.FC = () => <>
  <Composition id="RemogenReplica" component={RemogenReplica} durationInFrames={419} fps={30} width={736} height={414} defaultProps={{}} />
</>;
