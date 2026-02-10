import { forwardRef, useEffect, useState } from "react";

export type SecureVideoProps = Omit<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  "src"
> & {
  src: string;
};

export const SecureVideo = forwardRef<HTMLVideoElement, SecureVideoProps>(
  ({ src, onContextMenu, controlsList, ...rest }, ref) => {
    const [blobUrl, setBlobUrl] = useState<string | undefined>();

    useEffect(() => {
      let objectUrl: string | undefined;
      const controller = new AbortController();

      (async () => {
        try {
          const response = await fetch(src, { signal: controller.signal });
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          setBlobUrl(objectUrl);
        } catch (_error) {
          setBlobUrl(undefined);
        }
      })();

      return () => {
        controller.abort();
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [src]);

    return (
      <video
        {...rest}
        ref={ref}
        src={blobUrl}
        controlsList={controlsList ?? "nodownload"}
        onContextMenu={(event) => {
          event.preventDefault();
          onContextMenu?.(event);
        }}
      />
    );
  },
);

SecureVideo.displayName = "SecureVideo";

export default SecureVideo;
