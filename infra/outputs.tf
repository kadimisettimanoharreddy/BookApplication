output "cluster_name" {
  value = aws_eks_cluster.books_eks.name
}

output "cluster_endpoint" {
  value = aws_eks_cluster.books_eks.endpoint
}

output "cluster_arn" {
  value = aws_eks_cluster.books_eks.arn
}

output "node_group_role_arn" {
  value = aws_iam_role.eks_node_role.arn
}
