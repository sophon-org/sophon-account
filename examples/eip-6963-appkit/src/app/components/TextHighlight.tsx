const TextHighlight = ({ label, url }: { label: string; url: string }) => {
  return (
    <div className="relative shadow-[0px_12px_24px_-4px_#cce4ff] rounded-lg bg-aliceblue border-white border-solid border-[2px] box-border w-full max-w-[300px] overflow-hidden shrink-0 flex flex-row items-center justify-center py-[0.75rem] px-[1.25rem] text-center text-[1rem] text-royal-blue font-inter">
      <b className="relative tracking-[-0.01em] leading-[1.5rem]">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </b>
    </div>
  );
};

export default TextHighlight;
