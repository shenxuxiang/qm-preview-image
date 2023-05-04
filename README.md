# qm-preview-image

## Installation

```bash
npm install qm-preview-image

yarn add qm-preview-image
```


## Usage

```js
import { useState, useCallback } from 'react';
import img1 from '@/assets/images/1.jpg';
import img2 from '@/assets/images/2.jpg';
import img3 from '@/assets/images/3.jpg';
import img4 from '@/assets/images/4.jpg';
import img5 from '@/assets/images/5.jpg';
import PreviewImage from 'qm-preview-image';

const imgs = [img1, img2, img3, img4, img5];

export default function App() {
  const [visible, setVisible] = useState(false);
  const handleClose = useCallback(() => setVisible(() => false), []);
  return (
    <div>
      <button onClick={() => setVisible(true)>预览</button>

      <PreviewImage
        index={0}
        imgs={imgs}
        open={visible}
        hasPerformance
        // 如果没有缩略图和高清图的区分，只要提供 imgs 就行了。
        // previewImgs 表示缩略图的集合，如果提供了 previewImgs，请将 hasPerformance 设置为 true。
        previewImgs={imgs}
        onClose={handleClose}
      />
    </div>
  );
}
```


## props

| param            | detail                                         | type     | default         |
| ---------------- | -----------------------------------------------| -------- | -------         |
| open             | whether to display component                   | boolean  | false           |
| index            | which image to preview by default              | number   | 0               |
| imgs             | picture collection                             | string[] | []              |
| previewImgs      | provide a collection of thumbnails             | string[] | imgs            |
| hasPerformance   | indicator style color                          | boolean  | false           |
| onClose          | close the component                            | function | -               |
