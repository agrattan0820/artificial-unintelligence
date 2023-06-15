const UserCount = ({ count }: { count: number }) => {
  return (
    <div className="rounded-xl border border-gray-300 p-4">
      <p>{count.toLocaleString()} / 8 Players</p>
    </div>
  );
};

export default UserCount;
