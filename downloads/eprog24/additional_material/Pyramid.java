package pyramid;

import java.util.HashSet;

public class PyramidAlternativeSolution {
	/*
	 * Idee:
	 * Die Baumdatenstruktur wird in eine Matrix (2D-Array) umgewandelt, 
	 * da die Überprüfung der Bedingungen für eine Pyramidenstruktur 
	 * in dieser Form intuitiv iterativ möglich ist. 
	 * Jede Ebene des Baums entspricht einer Zeile in der Matrix, und die Knoten 
	 * werden entsprechend ihrer Position angeordnet.
	 *
	 * Um die Daten aufzubereiten, werden rekursive Funktionen genutzt, 
	 * da sie sich besonders gut eignen, um Bäume zu durchlaufen. 
	 * Dies macht den Teil des Codes kompakter und übersichtlicher.
	 * 
	 * Diese Lösung besteht alle Tests, wenn Sie die Tests aber Ausführen, wird
	 * durch den anderen Namen der Klasse Pyramid.java ausgeführt.
	 */
	public static boolean isPyramid(Node node) {
		HashSet<Node> reached = new HashSet<>();
		int h = getHeight(node, reached);
		Node[][] nodes = new Node[h][h];
		fillArr(node, 0, 0, nodes);
		
		/* 
		 * Bedingungen:
		 * 1. In der i-ten Ebene (nodes[i]) gibt es genau i+1 eindeutige Knoten.
		 * 2. Für jeden Knoten nodes[i][j] gilt:
		 *    - Linkes Kind befindet sich bei nodes[i+1][j].
		 *    - Rechtes Kind befindet sich bei nodes[i+1][j+1].
		 * 3. Alle Knoten in der letzten Ebene haben keine Kinder (getLeft() und getRight() sind null).
		 */
		
		HashSet<Node> allTraversed = new HashSet<>();
		HashSet<Node> traversed;
		for (int i = 0; i < h; i++) {
			traversed = new HashSet<>();
			for (int j = 0; j < h; j++) {
				Node curr = nodes[i][j];
				if (curr == null) continue;

				// Bedingung 1: Keine Dopplungen in der aktuellen Ebene oder in früheren Ebenen.
				traversed.add(curr);
				if ((j > i && curr != null) || (j == i && traversed.size() < i + 1) || allTraversed.contains(curr)) {
					return false;
				}

				// Bedingung 2: Linkes und rechtes Kind sind korrekt zugeordnet.
				if (i < nodes.length - 1) {
					Node lC = nodes[i + 1][j];
					Node rC = nodes[i + 1][j + 1];
					if (lC == null || lC != curr.getLeft()) return false;
					if (rC == null || rC != curr.getRight()) return false;
				} else {
					// Bedingung 3: Knoten in der letzten Ebene haben keine Kinder.
					if (curr.getLeft() != null || curr.getRight() != null) return false;
				}
			}
			// Speichere Knoten der aktuellen Ebene, um Dopplungen in späteren Ebenen zu vermeiden.
			allTraversed.addAll(traversed);
		}
		return true;
	}
	
	private static int getHeight(Node curr, HashSet<Node> reached) {
		// Rekursive Berechnung der Höhe des Baums mit Zykluserkennung.
		if (curr == null || reached.contains(curr)) return 0;
		reached.add(curr);
		return Math.max(getHeight(curr.getLeft(), reached) + 1, getHeight(curr.getRight(), reached) + 1);
	}
	
	private static void fillArr(Node curr, int i, int j, Node[][] nodes) {
		// Füllt das Array mit Knoten gemäß der Baumstruktur.
		if (curr == null || i >= nodes.length || j >= nodes.length) return;
		nodes[i][j] = curr;
		fillArr(curr.getLeft(), i + 1, j, nodes);
		fillArr(curr.getRight(), i + 1, j + 1, nodes);
	}

	public static void main(String[] args) {
		// Testfall 1: Eine gültige Pyramide.
		Node pyramid = new Node(new Node(null, null), new Node(null, null));
		System.out.println("Result: " + isPyramid(pyramid)); // Erwartet: true
		// Testfall 2: Ein Baum mit einem Zyklus.
		Node node1 = new Node(null, null);
		Node node2 = new Node(null, null);
		Node node3 = new Node(null, null);

		node1.setLeft(node2);
		node1.setRight(node3);

		// Erzeuge einen Zyklus: node2's left zeigt zurück auf node1
		node2.setLeft(node1);

		System.out.println("Result: " + isPyramid(node1)); // Erwartet: false (Zyklus erkannt)
	}
}
