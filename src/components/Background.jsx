import Creature from "./Creature.jsx";
import { useMetamorphosis } from "../hooks/useMetamorphosis.js";

// Fixed layer behind the page. It owns the scroll animation, so only this
// component re-draws while scrolling, not the whole page.
export default function Background({ mode }) {
  const frame = useMetamorphosis(mode);
  return (
    <div className="stage" aria-hidden="true">
      <Creature {...frame} />
    </div>
  );
}
