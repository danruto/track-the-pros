{
  description = "";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, ... }@inputs: {
    overlays.dev = nixpkgs.lib.composeManyExtensions [
    ];
  } // inputs.utils.lib.eachSystem [
    "x86_64-linux"
    "x86_64-darwin"
  ]
    (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
          overlays = [ self.overlays.dev ];
        };
      in
      {
        devShells.default =
          let
            name = "";
          in
          pkgs.mkShell {
            inherit name;

            packages = with pkgs; [
              nodePackages.typescript-language-server
              nodePackages.vscode-langservers-extracted
              tailwindcss-language-server
              biome

              deno
              netlify-cli

              nodePackages_latest.vercel
            ];
          };
      });
}
