const UserCount = ({ count }: { count: number }) => {
  return (
    <div className="rounded-xl md:border md:border-gray-300 md:p-4">
      <p>{count.toLocaleString()} / 8 Players</p>
    </div>
  );
};

export default UserCount;
