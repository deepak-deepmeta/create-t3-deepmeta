import { installPkgs } from "../helpers/get-pkg-manager";
import fs from "fs-extra";
import path from "path";
import { execa } from "../helpers/execa";
import { type Installer } from "./index";

export const prismaInstaller: Installer = async (
  projectDir,
  packageManager,
  packages
) => {
  await installPkgs({
    packageManager,
    projectDir,
    packages: ["prisma"],
    devMode: true,
  });
  await installPkgs({
    packageManager,
    projectDir,
    packages: ["@prisma/client"],
    devMode: false,
  });

  const prismaAssetDir = path.join(
    __dirname,
    "../../",
    "template/addons/prisma"
  );

  const schemaSrc = path.join(
    prismaAssetDir,
    packages.nextAuth.inUse ? "auth-schema.prisma" : "schema.prisma"
  );
  const schemaDest = path.join(projectDir, "prisma/schema.prisma");

  const clientSrc = path.join(prismaAssetDir, "client.ts");
  const clientDest = path.join(projectDir, "src/server/db/client.ts");

  const sampleApiRouteSrc = path.join(prismaAssetDir, "sample-api.ts");
  const sampleApiRouteDest = path.join(projectDir, "src/pages/api/examples.ts");

  // add postinstall script to package.json
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJsonContent = await fs.readJSON(packageJsonPath);
  packageJsonContent.scripts.postinstall = "prisma generate";

  await Promise.all([
    fs.copy(schemaSrc, schemaDest),
    fs.copy(clientSrc, clientDest),
    fs.copy(sampleApiRouteSrc, sampleApiRouteDest),
    fs.writeJSON(packageJsonPath, packageJsonContent, {
      spaces: 2,
    }),
  ]);

  const generateClientCmd =
    packageManager === "npm"
      ? "npx prisma generate"
      : `${packageManager} prisma generate`;
  await execa(generateClientCmd, { cwd: projectDir });
};