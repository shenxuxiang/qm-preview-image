import { useState } from "react";
import img1 from "@/assets/1.jpg";
import img2 from "@/assets/2.png";
import img3 from "@/assets/3.webp";
import img4 from "@/assets/4.jpg";
import img5 from "@/assets/5.jpg";
import img6 from "@/assets/6.jpg";
import img7 from "@/assets/7.webp";
import img8 from "@/assets/8.jpeg";
import img9 from "@/assets/9.webp";
import img10 from "@/assets/10.webp";
import img11 from "@/assets/11.webp";
import img12 from "@/assets/12.png";
import img13 from "@/assets/13.webp";
import img14 from "@/assets/14.webp";
import img15 from "@/assets/15.jpeg";
import img16 from "@/assets/16.png";
import img17 from "@/assets/17.webp";
import img18 from "@/assets/18.webp";
import img19 from "@/assets/19.jpg";
import img20 from "@/assets/20.jpg";
import img21 from "@/assets/21.jpg";
import img22 from "@/assets/22.jpg";
import img23 from "@/assets/23.jpg";
import img24 from "@/assets/24.webp";
import img25 from "@/assets/25.jpg";
import img26 from "@/assets/26.webp";
import img27 from "@/assets/27.jpg";
import img28 from "@/assets/28.webp";
import img29 from "@/assets/29.webp";
import img30 from "@/assets/30.jpg";

// import PreviewImage from '@/components/PreviewImage';
import PreviewImage from '../lib/qm-preview-image';

const imgs = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25, img26, img27, img28, img29, img30,
];

function App() {
  const [ open, setOpen ] = useState(false);
  const [ list, setList ] = useState<string[]>([]);

  return (
    <div>
      <div
        style={{ width: 120, height: 32, border: '1px solid #ddd' }}
        onClick={() => {
          setOpen(true);
        }}
      >
        hello world
      </div>

      <PreviewImage index={4} pageSize={9} open={open} imgs={imgs} previewImgs={imgs} onClose={() => setOpen(false)} hasPerformance/>
    </div>
  );
}

export default App;
