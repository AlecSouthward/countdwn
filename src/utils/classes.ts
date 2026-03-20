export const cn = (...classes: (string | undefined)[]) =>
  classes.filter((s) => !!s).join(' ');
