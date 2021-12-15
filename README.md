https://app.yinxiang.com/fx/1b0c1d05-4987-4e88-9191-a76714977cbd

- 为了部署到fisco bcos，需要按照其要求准备编译合约的环境，目录结构等
- 基于openzepplin 4.4.0版本构建，为了适应fisco bcos的合约编译环境只是将目录结构调整成同一目录，各合约引用的路径修改了，合约内容不做任何修改
- openzepplin 4.4.0合约中指定的solidity版本是0.8.0，但是fisco bcos只支持0.4/0.5/0.6，所以再将所有openzepplin的合约中的sol版本号改成0.6.0