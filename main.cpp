#include <string>
#include "json.hpp"
#include <iostream>
#include <fstream>
#include <stack>
#include <queue>

using json = nlohmann::ordered_json;

struct Movie {
    std::string name;
    std::string imgName;
    int val;
    float rating;

    Movie(int val, std::string name, float rating, std::string imgName): val(val), name(name), rating(rating), imgName(imgName) { }
};

//Comparison operators for building the Trees and Heaps
struct CompareValue {
    bool operator()(Movie const& p1, Movie const& p2)
    {
        return p1.val < p2.val;
    }
};

struct CompareRating {
    bool operator()(Movie const& p1, Movie const& p2)
    {
        return p1.rating < p2.rating;
    }
};


struct Node{
    Movie obj;
    Node *left;
    Node *right;

    Node(Movie newMovie): obj(newMovie), left (nullptr), right(nullptr) {}
};

class BST{
    Node *root = nullptr;
    int filter = 0;
public:
    void outputTree();
    void setFilter(int num);
    void insertNodeObj(Movie obj);
};

template<typename T>
Node* insertNode(Node* node, Movie newMovie, T compare) {

    if (node == nullptr){
        node = new Node(newMovie);
    }
    else if(compare.operator()(node->obj, newMovie)){
        node->right = insertNode(node->right, newMovie, compare);
    }
    else{
        node->left = insertNode(node->left, newMovie, compare);
    }
    return node;
}

void BST::setFilter(int num) {
    filter = num;
}

void BST::outputTree(){ //iterative traversal
    std::stack<Node*> stack;
    Node* node = root;
    json jsonObjects = json::array();
    std::ofstream o("moviesOut.json");
    //iterative traversal so I can fstream the entire object

    while (node != nullptr || !stack.empty())
    {
        while (node != nullptr)
        {
            stack.push(node);
            node = node->right;
        }

        node = stack.top();

        stack.pop();
        json j;

        j["Movie Name"] = node->obj.name;
        j["Image Path"] = node->obj.imgName;
        j["Value"] = node->obj.val;
        j["Rating"] = node->obj.rating;
        jsonObjects.push_back(j);

        node = node->left;
    }

    o << jsonObjects;
    std::cout << "done" << std::endl;
}


void BST::insertNodeObj(Movie obj) {
    if (filter == 3) {
        CompareRating r1;
        root = insertNode(root, obj, r1);
    }
    else {
        CompareValue r1;
        root = insertNode(root, obj , r1);
    }
}

//Heaps
template<typename T>
void HeapifyObjects(std::vector<Movie> mList, T priorityQueue, int filter){

    std::ofstream o("moviesOut.json");

    json jsonObjects = json::array();

    for(auto i : mList)
        priorityQueue.push(i);

    while(!priorityQueue.empty()){
        Movie movie = priorityQueue.top();
        priorityQueue.pop();
        json j;
        j["Movie Name"] = movie.name;
        j["Image Path"] = movie.imgName;
        j["Value"] = movie.val;
        j["Rating"] = movie.rating;
        jsonObjects.push_back(j);

    }
    o << jsonObjects;
    std::cout << "done" << std::endl;

}
//testfunction
std::vector<Movie> jsonRead(){
    std::vector<Movie> movieList;
    std::ifstream i("movies.json");
    json j = json::parse(i);
    for (unsigned int i = 0; i < j.size(); i++){
        Movie mov(j[i].at("Value"),j[i].at("Movie Name"),j[i].at("Rating"), j[i].at("Image Path"));
        movieList.push_back(mov);
    }

    return movieList;
}

int main(int argc, char** argv){
    //int filter = atoi(argv[1]);
    //int dataStructure = atoi(argv[2]);
    int dataStructure;
    int filter;

    std::cin >> dataStructure;
    std::cin >> filter;

    std::vector<Movie> movieList = jsonRead();

    if (dataStructure == 1) {
        BST movieTree;
        movieTree.setFilter(filter);
        for(unsigned int i = 0; i < movieList.size(); i++){
            movieTree.insertNodeObj(movieList[i]);
        }
        movieTree.outputTree();
    }
    else {
        if (filter == 3) {
            std::priority_queue<Movie, std::vector<Movie>, CompareRating> pq;
            HeapifyObjects(movieList, pq, filter);
        }
        else {
            std::priority_queue<Movie, std::vector<Movie>, CompareValue> pq;
            HeapifyObjects(movieList, pq, filter);
        }
    }
}
