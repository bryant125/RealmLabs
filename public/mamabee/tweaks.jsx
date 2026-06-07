// tweaks.jsx — mounts ONLY the Tweaks panel and applies values to the page.
const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mood": "golden",
  "headline": "The calm, AI-powered baby tracker.",
  "displayFont": "Nunito"
}/*EDITMODE-END*/;

const MOODS = {
  "Honey Warm": "honey",
  "Morning Cream": "cream",
  "Golden Hour": "golden",
};
const MOOD_LABEL = Object.fromEntries(Object.entries(MOODS).map(function (e) { return [e[1], e[0]]; }));

const HEADLINES = [
  "The calm, AI-powered baby tracker.",
  "Calm tracking for the chaotic 3 AM.",
  "All the logging. None of the paywalls.",
  "Track every little moment. Gently.",
];

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(function () {
    document.documentElement.setAttribute('data-mood', t.mood);
  }, [t.mood]);

  React.useEffect(function () {
    var el = document.getElementById('hero-headline');
    if (el) el.textContent = t.headline;
    document.title = t.headline + " — MamaBee";
  }, [t.headline]);

  React.useEffect(function () {
    var stack = t.displayFont === 'Quicksand'
      ? '"Quicksand", "Nunito", system-ui, sans-serif'
      : '"Nunito", "Quicksand", system-ui, sans-serif';
    document.documentElement.style.setProperty('--font-display', stack);
  }, [t.displayFont]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Visual mood" />
      <TweakRadio
        label="Mood"
        value={MOOD_LABEL[t.mood] || "Golden Hour"}
        options={Object.keys(MOODS)}
        onChange={function (v) { setTweak('mood', MOODS[v]); }}
      />
      <TweakSection label="Hero" />
      <TweakSelect
        label="Headline"
        value={t.headline}
        options={HEADLINES}
        onChange={function (v) { setTweak('headline', v); }}
      />
      <TweakSection label="Typography" />
      <TweakRadio
        label="Display font"
        value={t.displayFont}
        options={["Nunito", "Quicksand"]}
        onChange={function (v) { setTweak('displayFont', v); }}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
