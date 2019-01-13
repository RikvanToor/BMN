// Visuals
import Keys from './Assets/keys.svg';
import Monitor from './Assets/monitor.svg';
import Actor from './Assets/actor.svg';
import Amp from './Assets/amp.svg';
import Elevation from './Assets/elevation.svg';
import Guitar from './Assets/guitar.svg';
import Bass from './Assets/bass.svg';
import Drums from './Assets/drums.svg';
import PowerOutlet from './Assets/poweroutlet.svg';
import Mic from './Assets/mic.svg';
import Violin from './Assets/violin.svg';
import Trumpet from './Assets/trumpet.svg';

/**
 * Components for the stageplan editor
 */
export const componentMap = {
  actor: Actor,
  amp: Amp,
  bass: Bass,
  drums: Drums,
  elevation: Elevation,
  guitar: Guitar,
  keys: Keys,
  mic: Mic,
  monitor: Monitor,
  powerOutlet: PowerOutlet,
  violin: Violin,
  trumpet: Trumpet,
};

/**
 * Instrument names. Key should mimic supported elements in
 * "componentMap".
 */
export const elementTypes = {
  acousticGuitar: 'Akoestische gitaar',
  amp: 'Amp',
  bass: 'Bas',
  drums: 'Drums',
  elevation: 'Verhoging',
  guitar: 'Gitaar',
  keys: 'Keys',
  mic: 'Microfoon',
  monitor: 'Monitor',
  powerOutlet: 'Stroompunt',
  saxophone: 'Saxofoon',
  trumpet: 'Trompet',
  violin: 'Viool',
};
