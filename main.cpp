#include <string>
#include "json.hpp"
#include <iostream>
#include <fstream>
#include <stack>
#include <queue>

using json = nlohmann::json;

struct Movie {
    //Movie values
    std::string name; //title
    std::string imgName; //path for image
    std::string overview;
    long id;

    //filter values
    int budget;
    float rating;
    long revenue;
    float popularity;

    Movie(int budget, std::string name, float rating, std::string imgName, std::string overview, long revenue, float popularity, long id): overview(overview), revenue(revenue), popularity(popularity), id(id) , budget(budget), name(name), rating(rating), imgName(imgName) { }
};

//Comparison operators for building the Trees and Heaps
struct CompareBudget {
    bool operator()(Movie const& p1, Movie const& p2)
    {
        return p1.budget < p2.budget;
    }
};

struct CompareRating {
    bool operator()(Movie const& p1, Movie const& p2)
    {
        return p1.rating < p2.rating;
    }
};

struct CompareRevenue {
    bool operator()(Movie const& p1, Movie const& p2)
    {
        return p1.revenue < p2.revenue;
    }
};

struct ComparePopularity{
    bool operator()(Movie const& p1, Movie const& p2)
    {
        return p1.popularity < p2.popularity;
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
    else if(compare.operator()(node->obj, newMovie)){ //compare depends on the object put in
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
        json j; //outputs to stream
        j["title"] = node->obj.name;
        j["image path"] = node->obj.imgName;
        j["budget"] = node->obj.budget;
        j["rating"] = node->obj.rating;
        j["overview"] = node->obj.overview;
        j["id"] = node->obj.id;
        j["popularity"] = node->obj.popularity;
        j["revenue"] = node->obj.revenue;

        jsonObjects.push_back(j);

        node = node->left;
    }

    o << jsonObjects;

    std::cout << "done" << std::endl;
}


void BST::insertNodeObj(Movie obj) {
    switch (filter){
        case 1: {
            ComparePopularity r1;
            root = insertNode(root, obj , r1);
            break;
        }
        case 2: {
            CompareRevenue r1;
            root = insertNode(root, obj , r1);
            break;
        }
        case 3: {
            CompareRating r1;
            root = insertNode(root, obj, r1);
            break;
        }
        default: {
            CompareBudget r1;
            root = insertNode(root, obj , r1);
            break;
        }
    }
}

//Heaps
template<typename T>
void HeapifyObjects(std::vector<Movie> mList, T priorityQueue){

    std::ofstream o("moviesOut.json");

    json jsonObjects = json::array();

    for(auto i : mList)
        priorityQueue.push(i);

    while(!priorityQueue.empty()){
        Movie movie = priorityQueue.top();
        priorityQueue.pop();
        json j; //outputs to stream
        j["title"] = movie.name;
        j["image path"] = movie.imgName;
        j["budget"] = movie.budget;
        j["rating"] = movie.rating;
        j["overview"] = movie.overview;
        j["id"] = movie.id;
        j["popularity"] = movie.popularity;
        j["revenue"] = movie.revenue;
        jsonObjects.push_back(j);

    }
    o << jsonObjects;
    std::cout << "done" << std::endl;

}

std::vector<Movie> jsonRead(){ //reads the Json file
    std::vector<Movie> movieList;
    std::ifstream i("data.json");
    json j = json::parse(i); //parses through Json
    for (unsigned int i = 0; i < j.size(); i++){
        std::string poster_path;
        if(j[i].at("poster_path") != nullptr){
            poster_path = j[i].at("poster_path");
        }

        Movie mov(j[i].at("budget"),j[i].at("title"),j[i].at("vote_average"), poster_path,j[i].at("overview"), j[i].at("revenue"),j[i].at("popularity"), j[i].at("id"));
        movieList.push_back(mov);
    }
    return movieList;
}

void HeapifyController(std::vector<Movie> movieList, int filter){
    switch (filter){
        case 1: {
            std::priority_queue<Movie, std::vector<Movie>, ComparePopularity> pq;
            HeapifyObjects(movieList, pq);
            break;
        }
        case 2: {
            std::priority_queue<Movie, std::vector<Movie>, CompareRevenue> pq;
            HeapifyObjects(movieList, pq);
            break;
        }
        case 3: {
            std::priority_queue<Movie, std::vector<Movie>, CompareRating> pq;
            HeapifyObjects(movieList, pq);
            break;
        }
        default: {
            std::priority_queue<Movie, std::vector<Movie>, CompareBudget> pq;
            HeapifyObjects(movieList, pq);
            break;
        }
    }
}
void BSTController(std::vector<Movie> movieList, int filter){
    BST movieTree;
    movieTree.setFilter(filter);
    for(unsigned int i = 0; i < movieList.size(); i++){
        movieTree.insertNodeObj(movieList[i]);
    }
    movieTree.outputTree();
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
        BSTController(movieList, filter);
    }
    else {
        HeapifyController(movieList, filter);
    }
}
