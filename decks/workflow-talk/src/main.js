import Reveal from 'reveal.js';
import Highlight from 'reveal.js/plugin/highlight';
import Notes from 'reveal.js/plugin/notes';

import 'reveal.js/reveal.css';
import 'reveal.js/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';
import '@presentations/theme/theme.css';
import './deck.css';

const deck = new Reveal({
  hash: true,
  slideNumber: 'c/t',
  controlsTutorial: false,
  transition: 'slide',
  plugins: [Highlight, Notes],
});

deck.initialize();
