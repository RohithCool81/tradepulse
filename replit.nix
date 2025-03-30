{ pkgs }: {
    deps = [
        pkgs.nodejs-20_x
        pkgs.nodePackages.typescript-language-server
        pkgs.yarn
        pkgs.replitPackages.jest
    ];
    env = {
        NEXT_TELEMETRY_DISABLED = "1";
    };
} 