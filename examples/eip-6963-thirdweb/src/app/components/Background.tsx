const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <div className="absolute h-full w-full bg-white" />
      <div className="absolute w-full [filter:blur(100px)] [background:linear-gradient(-50.02deg,_rgba(235,_244,_255,_0.48),_rgba(115,_169,_224,_0.48)_84%)] h-[30rem]" />
      <div className="absolute top-[-0.25rem] left-[calc(50%_-_1428px)] [filter:drop-shadow(0px_4px_32px_rgba(0,_0,_0,_0.25))] w-[178.5rem] h-[70.5rem]">
        {children}
      </div>
    </div>
  );
};

export default Background;
