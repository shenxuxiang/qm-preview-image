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
        pageSize={9}
        open={visible}
        hasPerformance
        // 如果没有缩略图和高清图的区分，只要提供 imgs 就行了。
        // imgs 与 previewImgs 长度需要保持一致。
        // previewImgs 表示缩略图的集合，默认取 imgs。如果提供了 previewImgs，请将 hasPerformance 设置为 true。
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
| hasPerformance   | start image performance optimization           | boolean  | false           |
| onClose          | close the component                            | function | -               |
| pageSize         | Specify how many images can be displayed on a thumbnail page | number   | 9               |


## 图像展示性能优化方案

图像展示性能优化方案是通过提供一个与 `imgs` 数组长度一样的 `previewImg`s 数组，`previewImgs` 数组中提供的是缩略图（低像素），同时，需要将 `hasPerformance` 设置为 `true`。

在展示缩略图的同时浏览器在加载高清图，等高清图像下载完成后会自动切换成高清图像。

## 普通模式

`qm-preview-image` 组件同样也提供了普通的预览模式，只需要提供 `imgs` 数组对象即可，在预览时展示的就是 `imgs` 数组中提供的图像。
