const UserCount = ({ count }: { count: number }) => {
  return (
    <div className="rounded-xl lg:border lg:border-gray-300 lg:p-4">
      <p>{count.toLocaleString()} / 8 Players</p>
    </div>
  );
};

export default UserCount;
