

export const awaitTime = (millSecond: number) => new Promise<void>((resolve)=>{
  setTimeout(
    () => {
      resolve();
    },
    millSecond
  );
});
