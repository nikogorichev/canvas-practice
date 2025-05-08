type Props = {
  logs: Array<string>;
};
export function HistoryComponent(props: Props) {
  const { logs } = props;
  return (
    <>
      <h3>История действий:</h3>
      <ul>
        {logs.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </>
  );
}
