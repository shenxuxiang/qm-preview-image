class IntersectionImage {
  public intersection!: IntersectionObserver;
  constructor() {
    this.intersection = new IntersectionObserver(this.observerCallback as any);
  }

  observerCallback = (enters: IntersectionObserverEntry[]) => {
    const length = enters.length;
    for (let i = 0; i < length; i++) {
      const { target, intersectionRatio } = enters[i];
      if (intersectionRatio > 0) {
        this.unobserveImage(target);
        preloadImage(target as HTMLImageElement );
      }
    }
  }

  observeImage = (element: Element | Element[]) => {
    if (Array.isArray(element)) {
      element.forEach(item => this.intersection.observe(item));
    } else {
      this.intersection.observe(element);
    }
  }

  unobserveImage = (element: Element | Element[]) => {
    if (Array.isArray(element)) {
      element.forEach(item => this.intersection.unobserve(item));
    } else {
      this.intersection.unobserve(element);
    }
  }

  destroy() {
    this.intersection.disconnect();
  }
}

export default new IntersectionImage();

function preloadImage(element: HTMLImageElement) {
  const src = element.getAttribute('data-src')!;
  const img: any = new Image();
  img.src = src;
  img.onload = function() {
    element.src = src;
  };
}
