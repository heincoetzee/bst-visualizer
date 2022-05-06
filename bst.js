"use strict";

class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    #isEmpty() {
        return this.root === null;
    }

    search(target) {
        if (this.#isEmpty()) {
            return null;
        }
        else {
            return this.#search(target, this.root);
        }
    }
    #search(target, curNode) {
        // if current node equal to target then return it
        if (curNode !== null && curNode !== undefined) {
            if (curNode.value === target) {
                return curNode;
            }
            // if current node greater than target then go to left subtree
            else if (curNode.value > target) {
                return this.#search(target, curNode.left);
            }
            // if current node smaller than target then go to right subtree
            else if (curNode.value < target) {
                return this.#search(target, curNode.right);
            }
        }
        else {
            return null;
        }
    }

    inOrder() {
        this.#inOrder(this.root);
    }
    #inOrder(curNode) {
        if (curNode !== null) {
            this.#inOrder(curNode.left);
            console.log(curNode.value);
            this.#inOrder(curNode.right);
        }
    }

    insert(value) {
        let curNode = this.root;
        let preNode = null;

        while (curNode !== null) {
            preNode = curNode;
            // if current node greater than node to be inserted, then go to
            // left subtree
            if (curNode.value > value) {
                curNode = curNode.left;
            }
            // if current node less than or equal to node to be inserted, then go
            // to right subtree
            else if (curNode.value <= value) {
                curNode = curNode.right;
            }
        }

        // Create a new node
        let newNode = new BSTNode(value);

        // If tree is empty then insert at the root
        if (this.#isEmpty()) {
            this.root = newNode;
        }
        // Otherwise if parent node greater than new node then insert into left subtree
        else if (preNode.value > newNode.value) {
            preNode.left = newNode;
        }
        // Otherwise if parent node smaller than or equals to new node then insert
        // in to right subtree
        else if (preNode.value <= newNode.value) {
            preNode.right = newNode;
        }

    }

    delete(value) {
        let target = this.#search(value, this.root);
        if (target === null) {
            return;
        }

        if (this.#hasTwoChildren(target)) {
            let tmpNode = target.left;

            // find the rightmost leaf
            while (tmpNode.right !== null) {
                tmpNode = tmpNode.right;
            }

            // if the rightmost child has a left child, then let that left child
            // take it's place
            let parentNode = this.#getParentNode(tmpNode);
            if (tmpNode.left !== null) {
                if (parentNode.right === tmpNode) {
                    parentNode.right = tmpNode.left;
                }
                else {
                    parentNode.left = tmpNode.left;
                }
            }
            // Otherwise let parentNode not reference the rightmost child anymore
            else {
                if (parentNode.right === tmpNode) {
                    parentNode.right = null;
                }
                else {
                    parentNode.left = null;
                }
            }

            // Replace rightmost child with the target
            tmpNode.right = target.right;
            tmpNode.left = target.left;
            target.right = null;
            target.left = null;

            // if target has a parentNode, let it reference the rightmost child
            // instead of the target
            parentNode = this.#getParentNode(target);
            if (parentNode !== null) {
                if (parentNode.right === target) {
                    parentNode.right = tmpNode;
                }
                else {
                    parentNode.left = tmpNode;
                }
            }

            // If target is the root then let root reference the rightmost child
            if (this.#isRoot(target)) {
                this.root = tmpNode;
            }
        }
        else if ((this.#isRoot(target)) && (this.#hasOneChild(target))) {
            let child = this.#getOneChild(this.root);
            this.root = child;
        }
        else if ((this.#isRoot(target)) && (this.#hasNoChildren(target))) {
            this.root = null;
        }
        else if (this.#hasOneChild(target)) {
            // need to find it's parent and let it reference it's child
            let parentNode = this.#getParentNode(target);

            if (parentNode.left === target) {
                parentNode.left = this.#getOneChild(target);
            }
            else {
                parentNode.right = this.#getOneChild(target);
            }
        }
        else if (this.#hasNoChildren(target)) {
            // need to find it's parent and let it reference nothing
            let parentNode = this.#getParentNode(target);

            if (parentNode.left === target) {
                parentNode.left = null;
            }
            else {
                parentNode.right = null;
            }
        }
    }
    #hasNoChildren(node) {
        return (node.left === null) && (node.right === null);
    }
    #hasOneChild(node) {
        return (node.left !== null) || (node.right !== null);
    }
    #hasTwoChildren(node) {
        return (node.left !== null) && (node.right !== null);
    }
    #isRoot(node) {
        return node === this.root;
    }
    #getParentNode(node) {
        let curNode = this.root;
        let preNode = null;

        while (curNode !== node) {
            preNode = curNode;
            // if current node greater that target then go to left subtree
            if (curNode.value > node.value) {
                curNode = curNode.left;
            }
            // if current node less than or equal to target then go to right subtree
            else if (curNode.value <= node.value) {
                curNode = curNode.right;
            }
        }

        return preNode;
    }
    #getOneChild(node) {
        return node.left !== null ? node.left : node.right;
    }
}