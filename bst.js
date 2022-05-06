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
        return this.#search(target, this.root);
    }
    #search(target, curNode) {
        if (this.#isEmpty()) {
            return null;
        }
        else {
            // if current node equal to target then return it
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
    }

    inOrder(curNode) {
        if (curNode !== null) {
            this.preOrder(curNode.left);
            console.log(curNode.value);
            this.preOrder(curNode.right);
        }
    }

    insert(value) {
        curNode = this.root;
        preNode = null;

        while (curNode !== null) {
            preNode = curNode;
            // if current node greater than node to be inserted, then go to
            // left subtree
            if (curNode > value) {
                curNode = curNode.left;
            }
            // if current node less than or equal to node to be inserted, then go
            // to right subtree
            else if (curNode <= value) {
                curNode = curNode.right;
            }
        }

        // Create a new node
        newNode = new BSTNode(value);

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
        let target = this.#search(value);
        if (target === null) {
            return;
        }

        // if node found is the root

        if (this.#hasTwoChildren(target)) {
            let curNode = target.left;
            let preNode = null;

            // find the rightmost leaf
            while (curNode.right !== null) {
                preNode = curNode;
                curNode = curNode.right;
            }

            // if it has a left child then let it take it's place
            if (curNode.left !== null) {
                preNode.right = curNode.left;
            }
            else {
                preNode.right = null;
            }

            curNode.left = target.left;
            curNode.right = target.right;
            if (!this.#isRoot(target)) {
                let parentNode = this.#getParentNode(target);

                if (parentNode.left === target) {
                    parentNode.left = curNode;
                }
                else {
                    parentNode.right = curNode;
                }
            }
        }
        else if ((this.#isRoot(target)) && (this.#hasOneChild(target))) {
            this.root = this.#getOneChild(this.root);
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

        while (curNode !== null) {
            preNode = curNode;
            // if current node greater that target then go to left subtree
            if (curNode > target) {
                curNode = curNode.left;
            }
            // if current node less than or equal to target then go to right subtree
            else if (curNode <= target) {
                curNode = curNode.right;
            }
        }

        return preNode;
    }
    #getOneChild(node) {
        return node.left !== null ? node.left : node.right;
    }
}