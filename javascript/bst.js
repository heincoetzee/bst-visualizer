"use strict";

import {radius, originY} from "./config.js";

class Branch {
    constructor(startX, startY, endX, endY, originNode) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.originNode = originNode;
    }
}

class BSTNode {
    constructor(value) {
        this.value = value;
        this.x = 0;
        this.y = 0;

        this.leftBranch = null;
        this.rightBranch = null;

        this.leftNode = null;
        this.rightNode = null;
    }
}

export default class BST {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.root = null;
        this.values = [];
    }

    #isEmpty() {
        return this.root === null;
    }

    search(target) {
        if (this.#isEmpty()) {
            this.displayText(`${target} was not found. Tree is empty`);
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
                this.#drawOutline(curNode, "green");

                return curNode;
            }
            // if current node greater than target then go to left subtree
            else if (curNode.value > target) {
                this.#drawOutline(curNode, "red");

                return this.#search(target, curNode.leftNode);
            }
            // if current node smaller than target then go to right subtree
            else if (curNode.value < target) {
                this.#drawOutline(curNode, "red");

                return this.#search(target, curNode.rightNode);
            }
        }
        else {
            return null;
        }
    }

    inOrder(visit) {
        this.#inOrder(this.root, visit);
    }
    #inOrder(curNode, visit) {
        if (curNode !== null && curNode !== undefined) {
            this.#inOrder(curNode.leftNode, visit);
            visit(curNode);
            this.#inOrder(curNode.rightNode, visit);
        }
    }

    insert(value) {
        this.values.push(value);

        let curNode = this.root;
        let preNode = null;

        while (curNode !== null && curNode !== undefined) {
            preNode = curNode;
            // if current node greater than node to be inserted, then go to
            // left subtree
            if (curNode.value > value) {
                curNode = curNode.leftNode;
            }
            // if current node less than or equal to node to be inserted, then go
            // to right subtree
            else if (curNode.value <= value) {
                curNode = curNode.rightNode;
            }
        }

        // Create a new node
        let newNode = new BSTNode(value);

        // If tree is empty then insert at the root
        if (this.#isEmpty()) {
            this.root = newNode;

            newNode.x = this.canvas.width / 2;
            newNode.y = originY;

            this.#drawNode(newNode);
            this.displayText(`${value} was inserted`);
        }
        // Otherwise if parent node greater than new node then insert into left subtree
        else if (preNode.value > newNode.value) {
            const thirdOfRadius = (radius / 3);
            const twoThirdsOfRadius = (thirdOfRadius * 2);
            const spaceBetweenNodes = radius * 3;

            let branchStartX = preNode.x -  twoThirdsOfRadius;
            let branchStartY = (preNode.y + radius) - thirdOfRadius; 

            let branchEndX = preNode.x - spaceBetweenNodes + twoThirdsOfRadius;
            let branchEndY = preNode.y + spaceBetweenNodes - twoThirdsOfRadius;

            // Create the left branch and draw it
            preNode.leftBranch = new Branch(branchStartX, branchStartY, branchEndX,
                branchEndY, preNode);
            this.#drawLeftBranch(preNode.leftBranch);

            // Get the x and y coordinates of the newNode and draw it
            newNode.x = preNode.x - spaceBetweenNodes;
            newNode.y = preNode.y + spaceBetweenNodes;
            this.#drawNode(newNode);

            // lastly insert the node
            preNode.leftNode = newNode;
            this.displayText(`${value} was inserted`);
        }
        // Otherwise if parent node smaller than or equals to new node then insert
        // in to right subtree
        else if (preNode.value <= newNode.value) {
            const thirdOfRadius = (radius / 3);
            const twoThirdsOfRadius = (thirdOfRadius * 2);
            const spaceBetweenNodes = radius * 3;

            let branchStartX = preNode.x + twoThirdsOfRadius;
            let branchStartY = (preNode.y + radius) - thirdOfRadius; 

            let branchEndX = preNode.x + spaceBetweenNodes - twoThirdsOfRadius;
            let branchEndY = preNode.y + spaceBetweenNodes - twoThirdsOfRadius;

            // Create the right branch and draw it
            preNode.rightBranch = new Branch(branchStartX, branchStartY, branchEndX,
                branchEndY, preNode);
            this.#drawRightBranch(preNode.rightBranch);

            // Get the x and y coordinates of the newNode and draw it
            newNode.x = preNode.x + spaceBetweenNodes;
            newNode.y = preNode.y + spaceBetweenNodes;
            this.#drawNode(newNode);

            // lastly insert the node
            preNode.rightNode = newNode;
            this.displayText(`${value} was inserted`);
        }

    }

    deleteAll() {
        this.values.reverse();

        let element;
        while (element = this.values.pop()) {
            this.delete(element);
        }
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    delete(value) {
        let target = this.search(value);
        if (target === null) {
            return false;
        }

        if (this.#hasTwoChildren(target)) {
            let tmpNode = target.leftNode;

            // find the rightmost leaf
            while (tmpNode.rightNode !== null && tmpNode.rightNode !== undefined) {
                tmpNode = tmpNode.rightNode;
            }

            // if the rightmost child has a leftNode child, then let that leftBranch child
            // take it's place
            let parentNode = this.#getParentNode(tmpNode);
            if (tmpNode.leftNode !== null && tmpNode.leftNode !== undefined) {
                if (parentNode.rightNode === tmpNode) {
                    parentNode.rightNode = tmpNode.leftNode;
                    tmpNode.rightBranch = null;
                }
                else {
                    parentNode.leftNode = tmpNode.leftNode;
                    tmpNode.leftBranch = null;
                }
                this.#updateValues(tmpNode.leftNode);
            }
            // Otherwise let parentNode not reference the rightmost child anymore
            else {
                if (parentNode.rightNode === tmpNode) {
                    parentNode.rightNode = null;
                    parentNode.rightBranch = null
                }
                else {
                    parentNode.leftNode = null;
                    parentNode.leftBranch = null
                }
            }

            // Replace rightmost child with the target
            tmpNode.rightNode = target.rightNode;
            tmpNode.rightBranch = target.rightBranch;

            tmpNode.leftNode = target.leftNode;
            tmpNode.leftBranch = target.leftBranch

            target.rightNode = null;
            target.rightBranch = null;

            target.leftNode = null;
            target.rightBranch = null

            // if target has a parentNode, let it reference the rightmost child
            // instead of the target
            parentNode = this.#getParentNode(target);
            if (parentNode !== null) {
                if (parentNode.rightNode === target) {
                    parentNode.rightNode = tmpNode;
                }
                else {
                    parentNode.leftNode = tmpNode;
                }
                this.#updateValues(tmpNode);
            }

            // If target is the root then let root reference the rightmost child
            if (this.#isRoot(target)) {
                tmpNode.x = this.root.x;
                tmpNode.y = this.root.y;

                this.root = tmpNode;
            }
        }
        else if ((this.#isRoot(target)) && (this.#hasOneChild(target))) {
            let childNode = this.#getOneChild(this.root);

            if (this.root.leftNode === childNode) {
                this.root.leftNode = null;
                this.root.leftBranch = null;
            }
            else {
                this.root.rightNode = null;
                this.root.rightBranch = null;
            }

            // Then recursively update x and y of coordinates of each node 
            // and it's connected branches, starting at the child node
            this.#updateValues(childNode);
            this.root = childNode;
        }
        else if ((this.#isRoot(target)) && (this.#hasNoChildren(target))) {
            this.root = null;
        }
        else if (this.#hasOneChild(target)) {
            // need to find it's parent and let it reference it's child
            let parentNode = this.#getParentNode(target);

            let childNode = this.#getOneChild(target);
            if (parentNode.leftNode === target) {
                parentNode.leftNode = childNode;
                target.leftBranch = null;

            }
            else {
                parentNode.rightNode = childNode;
                target.rightBranch = null;
            }

            // Then recursively update x and y of coordinates of each node 
            // and it's connected branches, starting at the child node
            this.#updateValues(childNode);

        }
        else if (this.#hasNoChildren(target)) {
            // need to find it's parent and let it reference nothing
            let parentNode = this.#getParentNode(target);

            if (parentNode.leftNode === target) {
                parentNode.leftNode = null;
                parentNode.leftBranch = null;
            }
            else {
                parentNode.rightNode = null;
                parentNode.rightBranch = null;
            }
        }

        return true;
    }
    #hasNoChildren(node) {
        return (node.leftNode === null) && (node.rightNode === null);
    }
    #hasOneChild(node) {
        return (node.leftNode !== null) || (node.rightNode !== null);
    }
    #hasTwoChildren(node) {
        return (node.leftNode !== null) && (node.rightNode !== null);
    }
    #isRoot(node) {
        return node === this.root;
    }
    #getParentNode(node) {
        let curNode = this.root;
        let preNode = null;

        while (curNode !== node) {
            preNode = curNode;
            // if current node greater that target then go to leftNode subtree
            if (curNode.value > node.value) {
                curNode = curNode.leftNode;
            }
            // if current node less than or equal to target then go to rightNode subtree
            else if (curNode.value <= node.value) {
                curNode = curNode.rightNode;
            }
        }

        return preNode;
    }
    #getOneChild(node) {
        return node.leftNode !== null ? node.leftNode : node.rightNode;
    }
    #drawNode(node) {
        // Draw the text
        this.ctx.fillText(String(node.value), node.x, node.y);

        // Draw the circle
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    #drawLeftBranch(branch) {
        const arrowLength = radius - (radius / 4);
        this.ctx.beginPath();

        // Draw the line (/)
        //   /
        //  /
        // /
        this.ctx.moveTo(branch.startX, branch.startY);
        this.ctx.lineTo(branch.endX, branch.endY);

        // Create the arrow head
        // Draw the horizontal line (_)
        //   /
        //  /
        // /____
        this.ctx.moveTo(branch.endX, branch.endY);
        this.ctx.lineTo(branch.endX + arrowLength, branch.endY);

        // Draw the vertical line (|)
        //    /
        // | /
        // |/____
        this.ctx.moveTo(branch.endX, branch.endY);
        this.ctx.lineTo(branch.endX, branch.endY - arrowLength);
        this.ctx.stroke();
    }
    #drawRightBranch(branch) {
        const arrowLength = radius - (radius / 4);
        this.ctx.beginPath();

        // Create the arrow head
        // Draw the line (\)
        // \ 
        //  \
        //   \
        this.ctx.moveTo(branch.startX, branch.startY);
        this.ctx.lineTo(branch.endX, branch.endY);

        // Draw the horizontal line (_)
        //   \
        //    \
        // ____\
        this.ctx.moveTo(branch.endX, branch.endY);
        this.ctx.lineTo(branch.endX - arrowLength, branch.endY);


        // Draw the vertical line (|)
        //   \  
        //    \ |
        // ____\|
        this.ctx.moveTo(branch.endX, branch.endY);
        this.ctx.lineTo(branch.endX, branch.endY - arrowLength);
        this.ctx.stroke();
    }
    #drawOutline(curNode, color) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(curNode.x, curNode.y, radius + (radius / 4), 0, Math.PI * 2);
        this.ctx.stroke();
    }
    displayText(message) {
        this.ctx.textAlign = "left";
        this.ctx.font = "16px Lato";
        this.ctx.clearRect(10, 10, 300, 30);
        this.ctx.fillText(message, 20, 20);

        this.ctx.font = "18px Lato";
        this.ctx.textAlign = "center";
    }
    repaint() {
        this.ctx.strokeStyle = "black";
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.inOrder((curNode) => {
            // Redraw node and possible it's branches if any
            this.#drawNode(curNode);
            if (curNode.leftBranch !== null) {
                this.#drawLeftBranch(curNode.leftBranch);
            }
            if (curNode.rightBranch !== null) {
                this.#drawRightBranch(curNode.rightBranch);
            }
        });
    }
    #updateValues(node) {
        this.#inOrder(node, (curNode) => {
            const thirdOfRadius = (radius / 3);
            const twoThirdsOfRadius = (thirdOfRadius * 2);
            const spaceBetweenNodes = radius * 3;

            // Update the node's x and y coordinate
            let parentNode = this.#getParentNode(curNode);
            if (parentNode.leftNode === curNode) {
                curNode.x = curNode.x + spaceBetweenNodes;
                curNode.y = curNode.y - spaceBetweenNodes;
            }
            else {
                curNode.x = curNode.x - spaceBetweenNodes;
                curNode.y = curNode.y - spaceBetweenNodes;
            }

            // if node has a left branch then update it's x and y coordinates
            if (curNode.leftNode !== null && curNode.leftNode !== undefined) {
                // Update start coordinates
                curNode.leftBranch.startX = curNode.x -  twoThirdsOfRadius;
                curNode.leftBranch.startY = (curNode.y + radius) - thirdOfRadius; 

                // 
                curNode.leftBranch.endX = curNode.x - spaceBetweenNodes + twoThirdsOfRadius;
                curNode.leftBranch.endY = curNode.y + spaceBetweenNodes - twoThirdsOfRadius;
            }


            // if node has right branch then update it's x and y coordinates
            if (curNode.rightNode !== null && curNode.rightNode !== undefined) {
                curNode.rightBranch.startX = curNode.x + twoThirdsOfRadius;
                curNode.rightBranch.startY = (curNode.y + radius) - thirdOfRadius; 

                curNode.rightBranch.endX = curNode.x + spaceBetweenNodes - twoThirdsOfRadius;
                curNode.rightBranch.endY = curNode.y + spaceBetweenNodes - twoThirdsOfRadius;
            }
        });
    }
}