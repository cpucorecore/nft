https://app.yinxiang.com/fx/1b0c1d05-4987-4e88-9191-a76714977cbd

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
# 创建nft合约对象wines
truffle(develop)> wines = await Wines.deployed()
undefined

# 发行nft，指定发行的目标地址和该nft的uri链接
truffle(develop)> wines.issueWineNFT('0x5803f9025b1de9c76484fbd2b5976875bd669d5e', 'https://www.xxwine.com/products/tinghua/1.json')

# 查看nft的url
truffle(develop)> await wines.tokenURI(1)

# 查看nft的所有者
truffle(develop)> wines.ownerOf(1)

# 销毁nft
truffle(develop)> wines.burnWineNFT(1)
```


# truffle develop开发环境每次重新进入会重置数据
