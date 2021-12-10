# 环境准备
- install npm
- install truffle

# 安装
```shell
npm install .
```

# 运行demo
- 进入truffle develop开发环境
```shell
truffle develop
```
- 在truffle开发环境中部署合约
```shell
truffle(develop)> migrate
```

- 与部署的nft合约交互
```shell
# 创建nft合约实例
truffle(develop)> nft = await ERC721PresetMinterPauserAutoId.deployed()
undefined

# 发行nft
truffle(develop)> await nft.mint("0x5803f9025b1de9c76484fbd2b5976875bd669d5e")

# 查看nft的url
truffle(develop)> await nft.tokenURI(0)
'https://my-server/nftdemo/tokens/0'
```

# truffle develop开发环境每次重新进入会重置数据