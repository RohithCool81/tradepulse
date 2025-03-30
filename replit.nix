{
  description = "TradePulse - Trading Platform";
  
  deps = {
    pkgs = import <nixpkgs> {
      system = "x86_64-linux";
    };
  };

  env = {
    NEXT_TELEMETRY_DISABLED = "1";
  };

  packages = with pkgs; [
    nodejs_20
    nodePackages.npm
    nodePackages.yarn
    git
  ];
} 