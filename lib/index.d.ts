/// <reference types="react" />
import "@/assets/font/iconfont.css";
type IProps = {
    onClose: () => void;
    open: boolean;
    imgs: string[];
    previewImgs?: string[];
    hasPerformance?: boolean;
    index?: number;
};
/**
 * 图片预览功能组件
 * @param { open }           是否展示组件
 * @param { imgs }           图片列表
 * @param { index }          默认展示第几个图片，默认第一个
 * @param { onClose }        关闭组件的方法
 * @param { previewImgs }    缩略图展示列表
 * @param { hasPerformance } 是否启动IMG性能优化方案
 */
declare function PreviewImage(props: IProps): JSX.Element | null;
declare const _default: import("react").MemoExoticComponent<typeof PreviewImage>;
export default _default;
