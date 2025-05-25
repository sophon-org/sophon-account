const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute w-full h-1/3 [filter:blur(100px)] [background:linear-gradient(-50.02deg,_rgba(235,_244,_255,_0.48),_rgba(115,_169,_224,_0.48)_84%)]" />
      <div className="relative z-10 flex justify-center items-center min-h-screen">{children}</div>
    </div>
  );
};

export default Background;
