export default function MessageBubble({
  message = "",
  role = "assistant",
}) {
  return (
    <div data-role={role}>
      <strong>{role}:</strong> {message}
    </div>
  );
}
