import axe from 'axe-core';

export async function runAxe(
  element: HTMLElement,
  options?: axe.RunOptions,
): Promise<axe.AxeResults> {
  return axe.run(element, options);
}
