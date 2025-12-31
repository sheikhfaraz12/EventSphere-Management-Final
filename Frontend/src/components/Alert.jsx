const Alert = ({ message, type = 'error', onClose }) => {
  const types = {
    error: 'bg-red-100 text-red-700 border-red-400',
    success: 'bg-green-100 text-green-700 border-green-400',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-400'
  };
  return (
    <div className={`border px-4 py-3 rounded relative mb-4 ${types[type]}`}>
      {message}
      {onClose && (
        <button onClick={onClose} className="absolute top-0 right-0 px-4 py-3">×</button>
      )}
    </div>
  );
};

export default  Alert