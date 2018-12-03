import TreeNode from './TreeNode';

function Tree(data) {
  this.root = new TreeNode({ name: 'root', isLeaf: false, id: 0 });
  this.initNode(this.root, data);
  return this.root;
}

Tree.prototype.initNode = function (node, data) {
  for (let i = 0, len = data.length; i < len; i += 1) {
    const param = data[i];

    const child = new TreeNode(param);
    if (param.children && param.children.length > 0) {
      this.initNode(child, param.children);
    }
    node.addChildren(child);
  }
};

// exports.Tree = Tree;
// exports.TreeNode = TreeNode;
export default Tree;
// exports.Record = Record
