import { Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import Dojo from "../../app/dojo";
import "../../app/globals.css";
import "../../app/members.css";
import "../../app/story.css";
import "../../app/hud.css";
import "../../app/game-feel.css";
import "../../app/training.css";
import "../../app/pilot.css";
import "../../app/settings.css";

class LocalErrorBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() {
    if (this.state.failed) return <main style={{padding: 48}}><h1>Dojo needs a reload</h1><p>Your saved progress is on this computer.</p><button onClick={() => location.reload()}>Reload Dojo</button></main>;
    return this.props.children;
  }
}
createRoot(document.getElementById("root")!).render(<LocalErrorBoundary><Dojo /></LocalErrorBoundary>);
