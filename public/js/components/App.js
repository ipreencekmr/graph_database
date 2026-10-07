function SectionCard({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function PickSelector({ value, options, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function PersonForm({ name, onNameChange, onAddPerson }) {
  return (
    <div className="row">
      <input
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder="Name"
        aria-label="Name"
      />
      <button onClick={onAddPerson}>Add person</button>
    </div>
  );
}

function ConnectionPanel({
  graph,
  from,
  to,
  onFromChange,
  onToChange,
  onConnect,
  onFindPath,
  pathMsg,
}) {
  return (
    <SectionCard title="Connect or find a route">
      <div className="row">
        <PickSelector
          value={from}
          options={graph.nodes}
          onChange={onFromChange}
        />
        <PickSelector value={to} options={graph.nodes} onChange={onToChange} />
      </div>
      <div className="row">
        <button onClick={onConnect}>Connect</button>
        <button onClick={onFindPath}>Find shortest path</button>
      </div>
      {pathMsg && <p className="muted">{pathMsg}</p>}
    </SectionCard>
  );
}

function SuggestionsPanel({ graph, who, onWhoChange, onSuggest, suggestions }) {
  return (
    <SectionCard title="People you may know">
      <div className="row">
        <PickSelector
          value={who}
          options={graph.nodes}
          onChange={onWhoChange}
        />
        <button onClick={onSuggest}>Suggest</button>
      </div>
      {suggestions &&
        (suggestions.length ? (
          <ul>
            {suggestions.map((person) => (
              <li key={person.name}>
                {person.name}{" "}
                <span className="muted">({person.mutual} mutual)</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No second-degree connections yet.</p>
        ))}
    </SectionCard>
  );
}

function GraphApp() {
  const [graph, setGraph] = React.useState({ nodes: [], edges: [] });
  const [name, setName] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [path, setPath] = React.useState(null);
  const [pathMsg, setPathMsg] = React.useState("");
  const [who, setWho] = React.useState("");
  const [suggestions, setSuggestions] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function loadGraph() {
      try {
        const nextGraph = await window.graphApi.getGraph();
        setGraph(nextGraph);
      } catch (err) {
        setError(err.message);
      }
    }

    loadGraph();
  }, []);

  React.useEffect(() => {
    if (!graph.nodes.length) return;

    if (!from) setFrom(graph.nodes[0]);
    if (!to) setTo(graph.nodes[1] || graph.nodes[0]);
    if (!who) setWho(graph.nodes[0]);
  }, [graph, from, to, who]);

  const runAction = (callback) => async () => {
    setError("");

    try {
      await callback();
    } catch (err) {
      setError(err.message);
    }
  };

  const addPerson = runAction(async () => {
    const nextGraph = await window.graphApi.createNode(name);
    setGraph(nextGraph);
    setName("");
  });

  const connectPeople = runAction(async () => {
    const nextGraph = await window.graphApi.createEdge(from, to);
    setGraph(nextGraph);
    setPath(null);
  });

  const findShortestPath = runAction(async () => {
    const { path: nextPath } = await window.graphApi.findPath(from, to);
    setPath(nextPath);
    setPathMsg(
      nextPath
        ? `${nextPath.length - 1} hop(s): ${nextPath.join(" → ")}`
        : `No route from ${from} to ${to}.`,
    );
  });

  const suggestPeople = runAction(async () => {
    const payload = await window.graphApi.suggest(who);
    setSuggestions(payload.suggestions);
  });

  return (
    <main>
      <header>
        <h1>Who knows whom</h1>
        <p className="sub">
          A small graph database: Node + graphology on the server, React in the
          browser.
        </p>
      </header>

      <div className="card">
        <GraphView graph={graph} path={path} />
      </div>

      <div className="stack">
        <SectionCard title="Add a person">
          <PersonForm
            name={name}
            onNameChange={setName}
            onAddPerson={addPerson}
          />
        </SectionCard>

        <ConnectionPanel
          graph={graph}
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          onConnect={connectPeople}
          onFindPath={findShortestPath}
          pathMsg={pathMsg}
        />

        <SuggestionsPanel
          graph={graph}
          who={who}
          onWhoChange={setWho}
          onSuggest={suggestPeople}
          suggestions={suggestions}
        />

        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

window.GraphApp = GraphApp;
