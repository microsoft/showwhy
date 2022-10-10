namespaces="default backend frontend oauth-proxy ingress-nginx"

for n in $namespaces
do
    echo "------------------ $n namespace ------------------"
    kubectl get all,ingress -n $n
    echo
done