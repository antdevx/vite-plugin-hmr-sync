# 1.0.0 (2025-04-12)


### Bug Fixes

* add comment formatting for CODEOWNERS file ([d0e1586](https://github.com/antdevx/vite-plugin-hmr-sync/commit/d0e158680479317817ff440bb753abf034e9d0d2))
* add debug steps for Git references in release workflow and update main branch reference ([69fbb91](https://github.com/antdevx/vite-plugin-hmr-sync/commit/69fbb91d00e39e7aea7aee26e862d818b2e3a339))
* add prepare-release workflow and update release process to use release-temp branch ([9a96cc5](https://github.com/antdevx/vite-plugin-hmr-sync/commit/9a96cc5d020f8da715e67a45bb52b20235795a55))
* enable persist-credentials for improved authentication in release workflow ([2bf7d0e](https://github.com/antdevx/vite-plugin-hmr-sync/commit/2bf7d0e63d0214f542fe3ff60998aeae52f71a22))
* enable persist-credentials in release workflow for better authentication ([21e3064](https://github.com/antdevx/vite-plugin-hmr-sync/commit/21e3064c79f3e201561a07941374b7bf6f63fda1))
* enhance release workflow and permissions for GitHub actions ([68d0abc](https://github.com/antdevx/vite-plugin-hmr-sync/commit/68d0abc4f21988dd5860eca6b155e8ade2117e38))
* ensure all branches are fetched before syncing with main ([e1e1ea7](https://github.com/antdevx/vite-plugin-hmr-sync/commit/e1e1ea7fe77e586872e5dab55bdd05f73024788a))
* ensure GitHub Actions bot can push by adding token to checkout step ([1ad492b](https://github.com/antdevx/vite-plugin-hmr-sync/commit/1ad492bef5f72cbdaf08d814dbb82d54ede418e1))
* ensure GITHUB_TOKEN is set in the release workflow ([b52f80a](https://github.com/antdevx/vite-plugin-hmr-sync/commit/b52f80a779011d7c734b91e0b211e55f932ea175))
* include 'dist/**/*' in release assets and update package.json files field ([72a2551](https://github.com/antdevx/vite-plugin-hmr-sync/commit/72a2551f3f7ba0a3956cf7a13e6cf0470d365cc5))
* refactor release workflow to remove prepare-release job and update release process ([bdda61f](https://github.com/antdevx/vite-plugin-hmr-sync/commit/bdda61f86a84fb5ae586e9639799905d315203b7))
* remove comment formatting from CODEOWNERS file ([e481812](https://github.com/antdevx/vite-plugin-hmr-sync/commit/e481812cec653e6a49fdf8a02b1752a18945f52c))
* streamline release configuration by removing unused branches and updating workflow steps ([65ae796](https://github.com/antdevx/vite-plugin-hmr-sync/commit/65ae796faa95adcb823d126bf6f9ad888fa6dae4))
* uncomment authToken line in .npmrc for npm authentication ([f13f8ea](https://github.com/antdevx/vite-plugin-hmr-sync/commit/f13f8eab93d7c372d054b59a196854187190f8df))
* update branch reference from 'refs/heads/main' to 'main' in release configuration ([422b664](https://github.com/antdevx/vite-plugin-hmr-sync/commit/422b664eaab43c6b649490f6f153386548b72595))
* update CODEOWNERS to reflect correct owner ([2e56bbc](https://github.com/antdevx/vite-plugin-hmr-sync/commit/2e56bbcf39ebd17d903f8bcc953aba6a11e63e5f))
* update Git fetch command to target 'origin main' and add 'release-temp' branch to configuration ([502af0a](https://github.com/antdevx/vite-plugin-hmr-sync/commit/502af0ade2145bdd96a46588d664a6389c6d25b3))
* update GitHub token configuration in release workflow and semantic-release settings ([e081e2b](https://github.com/antdevx/vite-plugin-hmr-sync/commit/e081e2bfe60c451f138e9c25e13608909177754a))
* update GitHub token reference in prepare-release workflow ([411c287](https://github.com/antdevx/vite-plugin-hmr-sync/commit/411c28796a290eb5f996e83f03eca717a02936a8))
* update GitHub token reference in semantic-release step ([b84c2b0](https://github.com/antdevx/vite-plugin-hmr-sync/commit/b84c2b0b2726c989f91e99701971041d693cf959))
* update GITHUB_TOKEN reference in release workflow and configuration ([5adaba4](https://github.com/antdevx/vite-plugin-hmr-sync/commit/5adaba42e1693fc8e9d0cb8c77ae4269031e60be))
* update GITHUB_TOKEN secret from GH_TOKEN to GH_PAT in release workflow ([49d9076](https://github.com/antdevx/vite-plugin-hmr-sync/commit/49d9076327ef01abd497d96418015e2b1c635050))
* update GITHUB_TOKEN secret reference in release workflow ([a297a51](https://github.com/antdevx/vite-plugin-hmr-sync/commit/a297a5168e29ee5624a02a44eec6fb21c69e0a0d))
* update release workflow and package configuration to improve deployment process ([845d3fa](https://github.com/antdevx/vite-plugin-hmr-sync/commit/845d3fa7ff71f350668f5770908ddc31ad947ebc))
* update release workflow to improve clarity and functionality of steps ([1fc204e](https://github.com/antdevx/vite-plugin-hmr-sync/commit/1fc204e0517468d6e7a7fb22d82f1619f0393b76))
* update release workflow to trigger on closed pull requests ([fc88e19](https://github.com/antdevx/vite-plugin-hmr-sync/commit/fc88e19404ffffc9ec9464e86f4218abe12b4b43))
* update release workflow to trigger on push to main and adjust permissions ([12b88f5](https://github.com/antdevx/vite-plugin-hmr-sync/commit/12b88f5b8ef920d8d59f92d763e8ad8d229ed16d))
* update version to 1.0.1 in package.json and package-lock.json; add sync-release-to-main job in release workflow ([bda362c](https://github.com/antdevx/vite-plugin-hmr-sync/commit/bda362c6af1d3de7d4ca13d911e0759bee3b6cdb))


### Features

* add CODEOWNERS, CONTRIBUTING guide, PR template, and branch name validation workflow ([2920209](https://github.com/antdevx/vite-plugin-hmr-sync/commit/2920209b5306d70ea4b2466f3bfa6c6e54667985))
* initial commit of vite-plugin-hmr-sync ([023c34c](https://github.com/antdevx/vite-plugin-hmr-sync/commit/023c34c5f3faa0b7f91e56072a35f1e34dea9ddd))

# 1.0.0 (2025-04-12)


### Bug Fixes

* add comment formatting for CODEOWNERS file ([d0e1586](https://github.com/antdevx/vite-plugin-hmr-sync/commit/d0e158680479317817ff440bb753abf034e9d0d2))
* add debug steps for Git references in release workflow and update main branch reference ([69fbb91](https://github.com/antdevx/vite-plugin-hmr-sync/commit/69fbb91d00e39e7aea7aee26e862d818b2e3a339))
* add prepare-release workflow and update release process to use release-temp branch ([9a96cc5](https://github.com/antdevx/vite-plugin-hmr-sync/commit/9a96cc5d020f8da715e67a45bb52b20235795a55))
* enable persist-credentials for improved authentication in release workflow ([2bf7d0e](https://github.com/antdevx/vite-plugin-hmr-sync/commit/2bf7d0e63d0214f542fe3ff60998aeae52f71a22))
* enable persist-credentials in release workflow for better authentication ([21e3064](https://github.com/antdevx/vite-plugin-hmr-sync/commit/21e3064c79f3e201561a07941374b7bf6f63fda1))
* enhance release workflow and permissions for GitHub actions ([68d0abc](https://github.com/antdevx/vite-plugin-hmr-sync/commit/68d0abc4f21988dd5860eca6b155e8ade2117e38))
* ensure all branches are fetched before syncing with main ([e1e1ea7](https://github.com/antdevx/vite-plugin-hmr-sync/commit/e1e1ea7fe77e586872e5dab55bdd05f73024788a))
* ensure GitHub Actions bot can push by adding token to checkout step ([1ad492b](https://github.com/antdevx/vite-plugin-hmr-sync/commit/1ad492bef5f72cbdaf08d814dbb82d54ede418e1))
* ensure GITHUB_TOKEN is set in the release workflow ([b52f80a](https://github.com/antdevx/vite-plugin-hmr-sync/commit/b52f80a779011d7c734b91e0b211e55f932ea175))
* include 'dist/**/*' in release assets and update package.json files field ([72a2551](https://github.com/antdevx/vite-plugin-hmr-sync/commit/72a2551f3f7ba0a3956cf7a13e6cf0470d365cc5))
* refactor release workflow to remove prepare-release job and update release process ([bdda61f](https://github.com/antdevx/vite-plugin-hmr-sync/commit/bdda61f86a84fb5ae586e9639799905d315203b7))
* remove comment formatting from CODEOWNERS file ([e481812](https://github.com/antdevx/vite-plugin-hmr-sync/commit/e481812cec653e6a49fdf8a02b1752a18945f52c))
* streamline release configuration by removing unused branches and updating workflow steps ([65ae796](https://github.com/antdevx/vite-plugin-hmr-sync/commit/65ae796faa95adcb823d126bf6f9ad888fa6dae4))
* uncomment authToken line in .npmrc for npm authentication ([f13f8ea](https://github.com/antdevx/vite-plugin-hmr-sync/commit/f13f8eab93d7c372d054b59a196854187190f8df))
* update branch reference from 'refs/heads/main' to 'main' in release configuration ([422b664](https://github.com/antdevx/vite-plugin-hmr-sync/commit/422b664eaab43c6b649490f6f153386548b72595))
* update CODEOWNERS to reflect correct owner ([2e56bbc](https://github.com/antdevx/vite-plugin-hmr-sync/commit/2e56bbcf39ebd17d903f8bcc953aba6a11e63e5f))
* update Git fetch command to target 'origin main' and add 'release-temp' branch to configuration ([502af0a](https://github.com/antdevx/vite-plugin-hmr-sync/commit/502af0ade2145bdd96a46588d664a6389c6d25b3))
* update GitHub token configuration in release workflow and semantic-release settings ([e081e2b](https://github.com/antdevx/vite-plugin-hmr-sync/commit/e081e2bfe60c451f138e9c25e13608909177754a))
* update GitHub token reference in prepare-release workflow ([411c287](https://github.com/antdevx/vite-plugin-hmr-sync/commit/411c28796a290eb5f996e83f03eca717a02936a8))
* update GitHub token reference in semantic-release step ([b84c2b0](https://github.com/antdevx/vite-plugin-hmr-sync/commit/b84c2b0b2726c989f91e99701971041d693cf959))
* update GITHUB_TOKEN reference in release workflow and configuration ([5adaba4](https://github.com/antdevx/vite-plugin-hmr-sync/commit/5adaba42e1693fc8e9d0cb8c77ae4269031e60be))
* update GITHUB_TOKEN secret from GH_TOKEN to GH_PAT in release workflow ([49d9076](https://github.com/antdevx/vite-plugin-hmr-sync/commit/49d9076327ef01abd497d96418015e2b1c635050))
* update GITHUB_TOKEN secret reference in release workflow ([a297a51](https://github.com/antdevx/vite-plugin-hmr-sync/commit/a297a5168e29ee5624a02a44eec6fb21c69e0a0d))
* update release workflow and package configuration to improve deployment process ([845d3fa](https://github.com/antdevx/vite-plugin-hmr-sync/commit/845d3fa7ff71f350668f5770908ddc31ad947ebc))
* update release workflow to improve clarity and functionality of steps ([1fc204e](https://github.com/antdevx/vite-plugin-hmr-sync/commit/1fc204e0517468d6e7a7fb22d82f1619f0393b76))
* update release workflow to trigger on closed pull requests ([fc88e19](https://github.com/antdevx/vite-plugin-hmr-sync/commit/fc88e19404ffffc9ec9464e86f4218abe12b4b43))
* update release workflow to trigger on push to main and adjust permissions ([12b88f5](https://github.com/antdevx/vite-plugin-hmr-sync/commit/12b88f5b8ef920d8d59f92d763e8ad8d229ed16d))
* update version to 1.0.1 in package.json and package-lock.json; add sync-release-to-main job in release workflow ([bda362c](https://github.com/antdevx/vite-plugin-hmr-sync/commit/bda362c6af1d3de7d4ca13d911e0759bee3b6cdb))


### Features

* add CODEOWNERS, CONTRIBUTING guide, PR template, and branch name validation workflow ([2920209](https://github.com/antdevx/vite-plugin-hmr-sync/commit/2920209b5306d70ea4b2466f3bfa6c6e54667985))
* initial commit of vite-plugin-hmr-sync ([023c34c](https://github.com/antdevx/vite-plugin-hmr-sync/commit/023c34c5f3faa0b7f91e56072a35f1e34dea9ddd))

# 1.0.0 (2025-04-12)


### Bug Fixes

* add comment formatting for CODEOWNERS file ([d0e1586](https://github.com/antdevx/vite-plugin-hmr-sync/commit/d0e158680479317817ff440bb753abf034e9d0d2))
* add debug steps for Git references in release workflow and update main branch reference ([69fbb91](https://github.com/antdevx/vite-plugin-hmr-sync/commit/69fbb91d00e39e7aea7aee26e862d818b2e3a339))
* add prepare-release workflow and update release process to use release-temp branch ([9a96cc5](https://github.com/antdevx/vite-plugin-hmr-sync/commit/9a96cc5d020f8da715e67a45bb52b20235795a55))
* enable persist-credentials for improved authentication in release workflow ([2bf7d0e](https://github.com/antdevx/vite-plugin-hmr-sync/commit/2bf7d0e63d0214f542fe3ff60998aeae52f71a22))
* enable persist-credentials in release workflow for better authentication ([21e3064](https://github.com/antdevx/vite-plugin-hmr-sync/commit/21e3064c79f3e201561a07941374b7bf6f63fda1))
* enhance release workflow and permissions for GitHub actions ([68d0abc](https://github.com/antdevx/vite-plugin-hmr-sync/commit/68d0abc4f21988dd5860eca6b155e8ade2117e38))
* ensure all branches are fetched before syncing with main ([e1e1ea7](https://github.com/antdevx/vite-plugin-hmr-sync/commit/e1e1ea7fe77e586872e5dab55bdd05f73024788a))
* ensure GitHub Actions bot can push by adding token to checkout step ([1ad492b](https://github.com/antdevx/vite-plugin-hmr-sync/commit/1ad492bef5f72cbdaf08d814dbb82d54ede418e1))
* ensure GITHUB_TOKEN is set in the release workflow ([b52f80a](https://github.com/antdevx/vite-plugin-hmr-sync/commit/b52f80a779011d7c734b91e0b211e55f932ea175))
* include 'dist/**/*' in release assets and update package.json files field ([72a2551](https://github.com/antdevx/vite-plugin-hmr-sync/commit/72a2551f3f7ba0a3956cf7a13e6cf0470d365cc5))
* refactor release workflow to remove prepare-release job and update release process ([bdda61f](https://github.com/antdevx/vite-plugin-hmr-sync/commit/bdda61f86a84fb5ae586e9639799905d315203b7))
* remove comment formatting from CODEOWNERS file ([e481812](https://github.com/antdevx/vite-plugin-hmr-sync/commit/e481812cec653e6a49fdf8a02b1752a18945f52c))
* streamline release configuration by removing unused branches and updating workflow steps ([65ae796](https://github.com/antdevx/vite-plugin-hmr-sync/commit/65ae796faa95adcb823d126bf6f9ad888fa6dae4))
* uncomment authToken line in .npmrc for npm authentication ([f13f8ea](https://github.com/antdevx/vite-plugin-hmr-sync/commit/f13f8eab93d7c372d054b59a196854187190f8df))
* update branch reference from 'refs/heads/main' to 'main' in release configuration ([422b664](https://github.com/antdevx/vite-plugin-hmr-sync/commit/422b664eaab43c6b649490f6f153386548b72595))
* update CODEOWNERS to reflect correct owner ([2e56bbc](https://github.com/antdevx/vite-plugin-hmr-sync/commit/2e56bbcf39ebd17d903f8bcc953aba6a11e63e5f))
* update Git fetch command to target 'origin main' and add 'release-temp' branch to configuration ([502af0a](https://github.com/antdevx/vite-plugin-hmr-sync/commit/502af0ade2145bdd96a46588d664a6389c6d25b3))
* update GitHub token configuration in release workflow and semantic-release settings ([e081e2b](https://github.com/antdevx/vite-plugin-hmr-sync/commit/e081e2bfe60c451f138e9c25e13608909177754a))
* update GitHub token reference in prepare-release workflow ([411c287](https://github.com/antdevx/vite-plugin-hmr-sync/commit/411c28796a290eb5f996e83f03eca717a02936a8))
* update GitHub token reference in semantic-release step ([b84c2b0](https://github.com/antdevx/vite-plugin-hmr-sync/commit/b84c2b0b2726c989f91e99701971041d693cf959))
* update GITHUB_TOKEN reference in release workflow and configuration ([5adaba4](https://github.com/antdevx/vite-plugin-hmr-sync/commit/5adaba42e1693fc8e9d0cb8c77ae4269031e60be))
* update GITHUB_TOKEN secret from GH_TOKEN to GH_PAT in release workflow ([49d9076](https://github.com/antdevx/vite-plugin-hmr-sync/commit/49d9076327ef01abd497d96418015e2b1c635050))
* update GITHUB_TOKEN secret reference in release workflow ([a297a51](https://github.com/antdevx/vite-plugin-hmr-sync/commit/a297a5168e29ee5624a02a44eec6fb21c69e0a0d))
* update release workflow and package configuration to improve deployment process ([845d3fa](https://github.com/antdevx/vite-plugin-hmr-sync/commit/845d3fa7ff71f350668f5770908ddc31ad947ebc))
* update release workflow to improve clarity and functionality of steps ([1fc204e](https://github.com/antdevx/vite-plugin-hmr-sync/commit/1fc204e0517468d6e7a7fb22d82f1619f0393b76))
* update release workflow to trigger on closed pull requests ([fc88e19](https://github.com/antdevx/vite-plugin-hmr-sync/commit/fc88e19404ffffc9ec9464e86f4218abe12b4b43))
* update release workflow to trigger on push to main and adjust permissions ([12b88f5](https://github.com/antdevx/vite-plugin-hmr-sync/commit/12b88f5b8ef920d8d59f92d763e8ad8d229ed16d))
* update version to 1.0.1 in package.json and package-lock.json; add sync-release-to-main job in release workflow ([bda362c](https://github.com/antdevx/vite-plugin-hmr-sync/commit/bda362c6af1d3de7d4ca13d911e0759bee3b6cdb))


### Features

* add CODEOWNERS, CONTRIBUTING guide, PR template, and branch name validation workflow ([2920209](https://github.com/antdevx/vite-plugin-hmr-sync/commit/2920209b5306d70ea4b2466f3bfa6c6e54667985))
* initial commit of vite-plugin-hmr-sync ([023c34c](https://github.com/antdevx/vite-plugin-hmr-sync/commit/023c34c5f3faa0b7f91e56072a35f1e34dea9ddd))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial changelog structure.
