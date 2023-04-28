import { memo, useEffect, useRef } from 'react';
import classes from './index.module.less';
import Modal from '@/components/Modal';
import useReducer from './useReducer';
import Img from '@/components/Image';
import "@/assets/font/iconfont.css";

// 缩略图中每一个图片的宽度
const ITEM_WIDTH = 120;
const REG_TRANSFORMX = /translateX\(([\-.0-9]*)px\)/;
const REG_SCALE = /scale\(([\-.0-9]*)\, ([\-.0-9]*)\)/;
const REG_ROTATEZ = /rotateZ\(([\-.0-9]*)deg\)/

// 获取目标元素的 Transform 样式
function getTransformProperties(element: HTMLElement) {
  const style = element.style.transform;
  const scale = REG_SCALE.exec(style);
  const rotate = REG_ROTATEZ.exec(style);
  return { scaleX: Number(scale?.[1] ?? 1), scaleY: Number(scale?.[2] ?? 1), rotateZ: Number(rotate?.[1] ?? 0) }
}

function initialState() {
  return {
    currentIndex: 0,
    isEndPage: false,
    isStartPage: false,
  };
}

type IProps = {
  onClose: () => void;
  open: boolean;
  imgs: string[];
  previewImgs?: string[];
  hasPerformance?: boolean;
  index?: number;
}

/**
 * 图片预览功能组件
 * @param { open }           是否展示组件
 * @param { imgs }           图片列表
 * @param { index }          默认展示第几个图片，默认第一个
 * @param { onClose }        关闭组件的方法
 * @param { previewImgs }    缩略图展示列表
 * @param { hasPerformance } 是否启动IMG性能优化方案
 */
function PreviewImage(props: IProps) {
  const { onClose, open, imgs, previewImgs = imgs, index = 0, hasPerformance } = props;
  const [ state, setState ] = useReducer(initialState);
  const { currentIndex, isStartPage, isEndPage } = state;

  const imgRef = useRef<any>();
  // 滑块容器
  const sliderWrapperRef = useRef<any>();
  // 滑块
  const sliderRef = useRef<any>();
  const pageSizeRef = useRef(0);
  const totalRef = useRef(0);
  const isMounted = useRef(false);
  const largeImgListRef = useRef(imgs);

  useEffect(() => {
    function handleResize() {
      if (!sliderWrapperRef.current) return;
      const { clientWidth } = sliderWrapperRef.current;
      const mode = clientWidth % ITEM_WIDTH;
      if (mode > 110) {
        pageSizeRef.current = Math.ceil(clientWidth / ITEM_WIDTH);
      } else {
        pageSizeRef.current = Math.floor(clientWidth / ITEM_WIDTH);
      }
      totalRef.current = imgs.length;
      largeImgListRef.current = imgs;

      if (totalRef.current <= pageSizeRef.current) setState({ isEndPage: true, isStartPage: true });
    }

    if (open) {
      handleResize();
      isMounted.current = true;
      window.addEventListener('resize', handleResize, false);
    }
    return () => {
      window.removeEventListener('resize', handleResize, false);
    }
  }, [open, imgs, previewImgs]);

  useEffect(() => {
    if (open) {
      let currentIndex = index;
      if (index <= 0) {
        currentIndex = 0;
      } else if (index >= totalRef.current) {
        currentIndex = totalRef.current - 1;
      }
      sliderAnimation(currentIndex, 0);

      setState({
        currentIndex,
        isStartPage: currentIndex < Math.ceil(pageSizeRef.current / 2) || totalRef.current <= pageSizeRef.current,
        isEndPage: currentIndex > totalRef.current - 1 - Math.ceil(pageSizeRef.current / 2) || totalRef.current <= pageSizeRef.current,
      });
    }
  }, [open, index]);

  useEffect(() => {
    if (!hasPerformance) return;

    const largeImageUrl = largeImgListRef.current[currentIndex];
    const img = new Image();
    img.src = largeImageUrl;
    img.onload = () => {
      if (imgRef.current) imgRef.current.src = largeImageUrl;
    }

    return () => {
      img.onload = null;
    }
  }, [currentIndex]);

  // 动画效果
  const sliderAnimation = (index: number, duration = 300) => {
    if (!sliderRef.current || !sliderWrapperRef.current) return;

    if (totalRef.current <= pageSizeRef.current) return;

    const halfMaxSize = Math.ceil(pageSizeRef.current / 2);
    let offsetX = 0;
    if (index + 1 <= halfMaxSize) {
      offsetX = 0;
    } else if (index + 1 > totalRef.current - halfMaxSize) {
      offsetX = totalRef.current * ITEM_WIDTH - sliderWrapperRef.current.clientWidth;
    } else {
      offsetX = index * ITEM_WIDTH - sliderWrapperRef.current.clientWidth / 2 + ITEM_WIDTH / 2;
    }
    const cssText = `transform: translateX(${offsetX * -1}px); transition: transform ${duration}ms ease`;
    sliderRef.current.style.cssText = cssText;
  }

  const handlePrevItem = () => {
    if (currentIndex <= 0) return;
    imgRef.current.style.transform = `scale(1, 1) rotateZ(0deg)`;
    setState((prev) => {
      let count = prev.currentIndex - 1;
      count = count >= 0 ? count : 0;
      sliderAnimation(count);
      return {
        currentIndex: count,
        isStartPage: count < Math.ceil(pageSizeRef.current / 2),
        isEndPage: count > totalRef.current - 1 - Math.ceil(pageSizeRef.current / 2),
      };
    });
  };

  const handleNextItem = () => {
    if (currentIndex >= totalRef.current - 1) return;
    imgRef.current.style.transform = `scale(1, 1) rotateZ(0deg)`;
    setState((prev) => {
      let count = prev.currentIndex + 1;
      count = count >= totalRef.current ? totalRef.current - 1 : count;
      sliderAnimation(count);
      return {
        currentIndex: count,
        isStartPage: count < Math.ceil(pageSizeRef.current / 2),
        isEndPage: count > totalRef.current - 1 - Math.ceil(pageSizeRef.current / 2),
      };
    });
  };

  const handleChangeIndex = (index: number) => {
    if (currentIndex === index) return;
    imgRef.current.style.transform = `scale(1, 1) rotateZ(0deg)`;
    sliderAnimation(index);
    setState({
      currentIndex: index,
      isStartPage: index < Math.ceil(pageSizeRef.current / 2) || totalRef.current <= pageSizeRef.current,
      isEndPage: index > totalRef.current - 1 - Math.ceil(pageSizeRef.current / 2) || totalRef.current <= pageSizeRef.current,
    });
  }
  // 上一页，向右滚动一屏
  const handlePrevPage = () => {
    if (isStartPage) return;

    const transform = sliderRef.current.style.transform;
    const [, translateX = 0] = REG_TRANSFORMX.exec(transform) ?? [];
    let offsetX = Number(translateX) + pageSizeRef.current * ITEM_WIDTH;
    if (offsetX >= 0) {
      offsetX = 0;
      setState({ isStartPage: true, isEndPage: false });
    } else {
      setState({ isStartPage: false, isEndPage: false });
    }
    const cssText = `transform: translateX(${offsetX}px); transition: transform .3s ease`;
    sliderRef.current.style.cssText = cssText;
  }

  // 下一页，向左滚动一屏
  const handleNextPage = () => {
    if (isEndPage) return;

    const transform = sliderRef.current.style.transform;
    const { clientWidth } = sliderWrapperRef.current;
    const maxOffsetX = totalRef.current * ITEM_WIDTH - clientWidth;
    const [, translateX = 0] = REG_TRANSFORMX.exec(transform) ?? [];
    let offsetX = Number(translateX) - pageSizeRef.current * ITEM_WIDTH;
    if (offsetX <= -maxOffsetX) {
      offsetX = -maxOffsetX;
      setState({ isEndPage: true, isStartPage: false });
    } else {
      setState({ isEndPage: false, isStartPage: false });
    }
    const cssText = `transform: translateX(${offsetX}px); transition: transform .3s ease`;
    sliderRef.current.style.cssText = cssText;
  }

  // Y 轴镜像
  const handleMirrorY = () => {
    const { scaleX, scaleY, rotateZ } = getTransformProperties(imgRef.current);
    imgRef.current.style.transform = `scale(${scaleX}, ${scaleY * -1}) rotateZ(${rotateZ}deg)`;
  }

  // X 轴镜像
  const handleMirrorX= () => {
    const { scaleX, scaleY, rotateZ } = getTransformProperties(imgRef.current);
    imgRef.current.style.transform = `scale(${scaleX * -1}, ${scaleY}) rotateZ(${rotateZ}deg)`;
  }

  // 逆时针旋转90°
  const handleRotateLeft = () => {
    const { scaleX, scaleY, rotateZ } = getTransformProperties(imgRef.current);
    imgRef.current.style.transform = `scale(${scaleX}, ${scaleY}) rotateZ(${rotateZ - 90}deg)`;
  }

  // 顺时针旋转90°
  const handleRotateRight = () => {
    const { scaleX, scaleY, rotateZ } = getTransformProperties(imgRef.current);
    imgRef.current.style.transform = `scale(${scaleX}, ${scaleY}) rotateZ(${rotateZ + 90}deg)`;
  }

  // 放大
  const handleScalePlus = () => {
    const { scaleX, scaleY, rotateZ } = getTransformProperties(imgRef.current);
    imgRef.current.style.transform = `scale(${scaleX * 1.5}, ${scaleY * 1.5}) rotateZ(${rotateZ}deg)`;
  }

  // 缩小
  const handleScaleMinus = () => {
    const { scaleX, scaleY, rotateZ } = getTransformProperties(imgRef.current);
    let computedScaleX = scaleX / 1.5;
    let computedScaleY = scaleY / 1.5;
    computedScaleX = computedScaleX <= 1 ? 1 : computedScaleX;
    computedScaleY = computedScaleY <= 1 ? 1 : computedScaleY;

    imgRef.current.style.transform = `scale(${computedScaleX}, ${computedScaleY}) rotateZ(${rotateZ}deg)`;
  }
  // 初始化时，如果 open === false 则不渲染任何内容
  if (!open && !isMounted.current) return null;
  return (
    <Modal open={open}>
      <div style={{ width: '100%', height: '100%' }}>
        <div className={classes.head}>
          {/* Y 轴镜像 */}
          <i className={`qm-iconfont qm-icon-swap-outline ${classes.operationIcon} ${classes.rotate90}`} onClick={handleMirrorY}/>
          {/* X 轴镜像 */}
          <i className={`qm-iconfont qm-icon-swap-outline ${classes.operationIcon}`} onClick={handleMirrorX}/>
          {/* 逆时针旋转 90deg */}
          <i className={`qm-iconfont qm-icon-rotate-left ${classes.operationIcon}`} onClick={handleRotateLeft}/>
          {/* 顺时针旋转 90deg */}
          <i className={`qm-iconfont qm-icon-rotate-right ${classes.operationIcon}`} onClick={handleRotateRight}/>
          {/* 缩小 */}
          <i className={`qm-iconfont qm-icon-minus-circle ${classes.operationIcon}`} onClick={handleScaleMinus}/>
          {/* 放大 */}
          <i className={`qm-iconfont qm-icon-plus-circle ${classes.operationIcon}`} onClick={handleScalePlus}/>
          {/* 关闭预览弹框 */}
          <i className={`qm-iconfont qm-icon-close ${classes.operationIcon}`} onClick={onClose}/>
        </div>
        <div className={classes.body}>
          {/* 上一张 */}
          <div
            onClick={handlePrevItem}
            className={`${classes.prevButton}${currentIndex === 0 ? ' ' + classes.disabled : ''}`}
          >
            <i className="qm-iconfont qm-icon-arrow-left-bold" style={{ fontSize: 60 }}/>
          </div>
          {/* 图片预览部分 */}
          <div className={classes.bodyContent}>
            <img
              ref={imgRef}
              alt="预览图片"
              src={previewImgs[currentIndex]}
              className={classes.previewImg}
              style={{ transform: 'scale(1, 1) rotateZ(0)' }}
            />
          </div>
          {/* 下一张 */}
          <div
            onClick={handleNextItem}
            className={`${classes.nextButton}${currentIndex >= totalRef.current - 1 ? ' ' + classes.disabled : ''}`}
          >
            <i className="qm-iconfont qm-icon-arrow-right-bold" style={{ fontSize: 60 }}/>
          </div>
        </div>
        {/* 底部滑块 */}
        <div className={classes.foot}>
          {/* 上一页 */}
          <div className={`${classes.footPrevButton}${isStartPage ? ' ' + classes.disabled : ''}`} onClick={handlePrevPage}>
            <i className="qm-iconfont qm-icon-arrow-left-bold" style={{ fontSize: 30 }}/>
          </div>
          {/* 下一页 */}
          <div
            onClick={handleNextPage}
            className={`${classes.footNextButton}${isEndPage ? ' ' + classes.disabled : ''}`}
          >
            <i className="qm-iconfont qm-icon-arrow-right-bold" style={{ fontSize: 30 }}/>
          </div>
          {/* 滑块 */}
          <div className={classes.footSlider} ref={sliderWrapperRef}>
            <ul className={classes.footSliderList} ref={sliderRef}>
              {
                previewImgs.map((url: string, index: number) =>
                  <li
                    key={`${url}~${index}`}
                    onClick={() => handleChangeIndex(index)}
                    className={`${classes.footSliderListItem}${currentIndex === index ? ' ' + classes.active : ''}`}
                  >
                    <Img src={url} alt="pic"/>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default memo(PreviewImage);
