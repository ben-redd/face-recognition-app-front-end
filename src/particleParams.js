const particleParams = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 1200,
      },
    },
    line_linked: {
      enable: true,
      opacity: 0.3,
    },
    move: {
      random: true,
      speed: 1.5,
      out_mode: 'out',
    },
    size: {
      value: 1,
    },
  },
  retina_detect: true,
};

export default particleParams;
