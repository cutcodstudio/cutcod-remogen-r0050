# Independent Remogen reconstruction at pinned source 151aac1f2ad1dec7dd886e185321fddf5b64f65b

## Render

npm ci
npx remotion render RemogenReplica out/remogen-replica.mp4 --codec=h264 --crf=18

The composition is 736x414, 30fps, 419 encoded video frames (0..418), and uses only parameterized React/SVG/CSS plus the permitted extracted audio `public/reference-audio.m4a`. It never plays or samples the reference video.
